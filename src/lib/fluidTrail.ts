type Target = { texture: WebGLTexture; framebuffer: WebGLFramebuffer; width: number; height: number };
type Pair = { read: Target; write: Target };
type Point = { x: number; y: number; dx: number; dy: number; color: number[] };
const vertex = `#version 300 es
in vec2 position;out vec2 uv;void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const base = `#version 300 es
precision highp float;in vec2 uv;out vec4 result;`;
const shaders = {
  splat: `${base}uniform sampler2D field;uniform vec2 point;uniform vec3 value;uniform float radius;uniform float aspect;void main(){vec2 d=uv-point;d.x*=aspect;result=texture(field,uv)+vec4(value*exp(-dot(d,d)/radius),0.);}`,
  advect: `${base}uniform sampler2D field;uniform sampler2D velocity;uniform vec2 pixel;uniform float dt;uniform float decay;void main(){vec2 p=uv-dt*texture(velocity,uv).xy*pixel;result=texture(field,p)*decay;}`,
  curl: `${base}uniform sampler2D velocity;uniform vec2 pixel;void main(){float l=texture(velocity,uv-vec2(pixel.x,0)).y;float r=texture(velocity,uv+vec2(pixel.x,0)).y;float b=texture(velocity,uv-vec2(0,pixel.y)).x;float t=texture(velocity,uv+vec2(0,pixel.y)).x;result=vec4(.5*(r-l-t+b),0,0,1);}`,
  vortex: `${base}uniform sampler2D velocity;uniform sampler2D curl;uniform vec2 pixel;uniform float dt;void main(){float l=texture(curl,uv-vec2(pixel.x,0)).x;float r=texture(curl,uv+vec2(pixel.x,0)).x;float b=texture(curl,uv-vec2(0,pixel.y)).x;float t=texture(curl,uv+vec2(0,pixel.y)).x;float c=texture(curl,uv).x;vec2 force=.5*vec2(abs(t)-abs(b),abs(r)-abs(l));force/=length(force)+.0001;force*=24.*c;force.y*=-1.;result=vec4(clamp(texture(velocity,uv).xy+force*dt,vec2(-300.),vec2(300.)),0,1);}`,
  divergence: `${base}uniform sampler2D velocity;uniform vec2 pixel;void main(){float l=texture(velocity,uv-vec2(pixel.x,0)).x;float r=texture(velocity,uv+vec2(pixel.x,0)).x;float b=texture(velocity,uv-vec2(0,pixel.y)).y;float t=texture(velocity,uv+vec2(0,pixel.y)).y;result=vec4(.5*(r-l+t-b),0,0,1);}`,
  pressure: `${base}uniform sampler2D pressure;uniform sampler2D divergence;uniform vec2 pixel;void main(){float l=texture(pressure,uv-vec2(pixel.x,0)).x;float r=texture(pressure,uv+vec2(pixel.x,0)).x;float b=texture(pressure,uv-vec2(0,pixel.y)).x;float t=texture(pressure,uv+vec2(0,pixel.y)).x;result=vec4((l+r+b+t-texture(divergence,uv).x)*.25,0,0,1);}`,
  project: `${base}uniform sampler2D pressure;uniform sampler2D velocity;uniform vec2 pixel;void main(){float l=texture(pressure,uv-vec2(pixel.x,0)).x;float r=texture(pressure,uv+vec2(pixel.x,0)).x;float b=texture(pressure,uv-vec2(0,pixel.y)).x;float t=texture(pressure,uv+vec2(0,pixel.y)).x;result=vec4(texture(velocity,uv).xy-vec2(r-l,t-b)*.5,0,1);}`,
  display: `${base}uniform sampler2D dye;uniform float opacity;void main(){vec3 c=max(texture(dye,uv).rgb,vec3(0.));float peak=max(c.r,max(c.g,c.b));float a=opacity*(1.-exp(-peak*.7));result=vec4(c/max(peak,.0001)*a,a);}`,
};
export function createFluidTrail(canvas: HTMLCanvasElement, palette: number[][], options: { opacity: number; radius: number; resolution: number }) {
  const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
  if (!gl || !gl.getExtension('EXT_color_buffer_float')) return null;
  const programs: WebGLProgram[] = [], textures: WebGLTexture[] = [], framebuffers: WebGLFramebuffer[] = [];
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;gl.shaderSource(shader,source);gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){const error=gl.getShaderInfoLog(shader);gl.deleteShader(shader);throw new Error(error || 'Fluid shader unavailable');}return shader;
  };
  const makeProgram = (source: string) => {
    const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,source),program=gl.createProgram()!;
    gl.attachShader(program,vs);gl.attachShader(program,fs);gl.bindAttribLocation(program,0,'position');gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);programs.push(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Fluid program unavailable');return program;
  };
  const buffer=gl.createBuffer()!;gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const vao=gl.createVertexArray()!;gl.bindVertexArray(vao);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
  const dispose=()=>{programs.forEach(p=>gl.deleteProgram(p));textures.forEach(t=>gl.deleteTexture(t));framebuffers.forEach(f=>gl.deleteFramebuffer(f));gl.deleteBuffer(buffer);gl.deleteVertexArray(vao);};
  try {
    const passes=Object.fromEntries(Object.entries(shaders).map(([key,value])=>[key,makeProgram(value)]));
    const makeTarget=(width:number,height:number):Target=>{
      const texture=gl.createTexture()!;textures.push(texture);gl.bindTexture(gl.TEXTURE_2D,texture);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA16F,width,height,0,gl.RGBA,gl.HALF_FLOAT,null);
      const framebuffer=gl.createFramebuffer()!;framebuffers.push(framebuffer);gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);
      if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw new Error('Fluid framebuffer unavailable');
      gl.viewport(0,0,width,height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);return {texture,framebuffer,width,height};
    };
    const makePair=(w:number,h:number):Pair=>({read:makeTarget(w,h),write:makeTarget(w,h)});
    const aspect=canvas.width/canvas.height;
    const size=options.resolution;
    const w=aspect>=1?Math.round(size*aspect):size,h=aspect>=1?size:Math.round(size/aspect);
    const velocity=makePair(w,h),dye=makePair(w*3,h*3),pressure=makePair(w,h),curl=makeTarget(w,h),divergence=makeTarget(w,h);
    const swap=(pair:Pair)=>{[pair.read,pair.write]=[pair.write,pair.read];};
    const pixel=[1/w,1/h];
    const uniforms=new Map<WebGLProgram,Map<string,WebGLUniformLocation|null>>();
    const run=(name:string,target:Target|null,values:Record<string,number|number[]|Target>)=>{
      const program=passes[name];gl.useProgram(program);gl.bindVertexArray(vao);
      const locations=uniforms.get(program)||new Map<string,WebGLUniformLocation|null>();uniforms.set(program,locations);
      let textureUnit=0;
      for(const [key,value] of Object.entries(values)){
        if(!locations.has(key))locations.set(key,gl.getUniformLocation(program,key));const loc=locations.get(key)!;
        if(typeof value==='number')gl.uniform1f(loc,value);
        else if(Array.isArray(value)){if(value.length===2)gl.uniform2fv(loc,value);else gl.uniform3fv(loc,value);}
        else {gl.activeTexture(gl.TEXTURE0+textureUnit);gl.bindTexture(gl.TEXTURE_2D,value.texture);gl.uniform1i(loc,textureUnit++);}
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER,target?.framebuffer||null);gl.viewport(0,0,target?.width||canvas.width,target?.height||canvas.height);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    };
    let queued:Point[]=[],colorIndex=0,lastColor=0;
    return {
      add(x:number,y:number,dx:number,dy:number,time:number){
        if(time-lastColor>450){colorIndex=(colorIndex+1)%palette.length;lastColor=time;}
        queued.push({x,y,dx,dy,color:palette[colorIndex]});if(queued.length>12)queued.shift();
      },
      step(dt:number){
        gl.disable(gl.BLEND);
        run('advect',velocity.write,{field:velocity.read,velocity:velocity.read,pixel,dt,decay:Math.exp(-dt*1.1)});swap(velocity);
        for(const p of queued){
          run('splat',velocity.write,{field:velocity.read,point:[p.x,p.y],value:[p.dx*9000,p.dy*9000,0],radius:options.radius,aspect});swap(velocity);
          run('splat',dye.write,{field:dye.read,point:[p.x,p.y],value:p.color.map(c=>c*2),radius:options.radius,aspect});swap(dye);
        }
        queued=[];
        run('curl',curl,{velocity:velocity.read,pixel});
        run('vortex',velocity.write,{velocity:velocity.read,curl,pixel,dt});swap(velocity);
        run('divergence',divergence,{velocity:velocity.read,pixel});
        for(let i=0;i<12;i++){run('pressure',pressure.write,{pressure:pressure.read,divergence,pixel});swap(pressure);}
        run('project',velocity.write,{velocity:velocity.read,pressure:pressure.read,pixel});swap(velocity);
        run('advect',dye.write,{field:dye.read,velocity:velocity.read,pixel,dt,decay:Math.exp(-dt*0.8)});swap(dye);
        run('display',null,{dye:dye.read,opacity:options.opacity});
      },
      clear(){for(const t of [velocity.read,velocity.write,dye.read,dye.write,pressure.read,pressure.write,curl,divergence]){gl.bindFramebuffer(gl.FRAMEBUFFER,t.framebuffer);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);}gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.clear(gl.COLOR_BUFFER_BIT);queued=[];},
      dispose,
    };
  } catch {dispose();return null;}
}
