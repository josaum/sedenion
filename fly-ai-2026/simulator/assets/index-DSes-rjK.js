(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();function Wt(n,t,e,i){function r(s){return s instanceof e?s:new e(function(o){o(s)})}return new(e||(e=Promise))(function(s,o){function a(u){try{l(i.next(u))}catch(h){o(h)}}function c(u){try{l(i.throw(u))}catch(h){o(h)}}function l(u){u.done?s(u.value):r(u.value).then(a,c)}l((i=i.apply(n,t||[])).next())})}function Bh(n){var t=typeof Symbol=="function"&&Symbol.iterator,e=t&&n[t],i=0;if(e)return e.call(n);if(n&&typeof n.length=="number")return{next:function(){return n&&i>=n.length&&(n=void 0),{value:n&&n[i++],done:!n}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}function Jt(n){return this instanceof Jt?(this.v=n,this):new Jt(n)}function Ti(n,t,e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var i=e.apply(n,t||[]),r,s=[];return r=Object.create((typeof AsyncIterator=="function"?AsyncIterator:Object).prototype),a("next"),a("throw"),a("return",o),r[Symbol.asyncIterator]=function(){return this},r;function o(f){return function(g){return Promise.resolve(g).then(f,h)}}function a(f,g){i[f]&&(r[f]=function(_){return new Promise(function(m,p){s.push([f,_,m,p])>1||c(f,_)})},g&&(r[f]=g(r[f])))}function c(f,g){try{l(i[f](g))}catch(_){d(s[0][3],_)}}function l(f){f.value instanceof Jt?Promise.resolve(f.value.v).then(u,h):d(s[0][2],f)}function u(f){c("next",f)}function h(f){c("throw",f)}function d(f,g){f(g),s.shift(),s.length&&c(s[0][0],s[0][1])}}function Ia(n){var t,e;return t={},i("next"),i("throw",function(r){throw r}),i("return"),t[Symbol.iterator]=function(){return this},t;function i(r,s){t[r]=n[r]?function(o){return(e=!e)?{value:Jt(n[r](o)),done:!1}:s?s(o):o}:s}}function Es(n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t=n[Symbol.asyncIterator],e;return t?t.call(n):(n=typeof Bh=="function"?Bh(n):n[Symbol.iterator](),e={},i("next"),i("throw"),i("return"),e[Symbol.asyncIterator]=function(){return this},e);function i(s){e[s]=n[s]&&function(o){return new Promise(function(a,c){o=n[s](o),r(a,c,o.done,o.value)})}}function r(s,o,a,c){Promise.resolve(c).then(function(l){s({value:l,done:a})},o)}}const Oh=new TextDecoder("utf-8"),Ll=Oh.decode.bind(Oh),gg=new TextEncoder,Nu=n=>gg.encode(n),xg=n=>typeof n=="number",_g=n=>typeof n=="boolean",bn=n=>typeof n=="function",fi=n=>n!=null&&Object(n)===n,Ro=n=>fi(n)&&bn(n.then),Rc=n=>fi(n)&&bn(n[Symbol.iterator]),Bu=n=>fi(n)&&bn(n[Symbol.asyncIterator]),Pl=n=>fi(n)&&fi(n.schema),Ff=n=>fi(n)&&"done"in n&&"value"in n,Nf=n=>fi(n)&&bn(n.stat)&&xg(n.fd),Bf=n=>fi(n)&&Ou(n.body),Of=n=>"_getDOMStream"in n&&"_getNodeStream"in n,Ou=n=>fi(n)&&bn(n.cancel)&&bn(n.getReader)&&!Of(n),zf=n=>fi(n)&&bn(n.read)&&bn(n.pipe)&&_g(n.readable)&&!Of(n),vg=n=>fi(n)&&bn(n.clear)&&bn(n.bytes)&&bn(n.position)&&bn(n.setPosition)&&bn(n.capacity)&&bn(n.getBufferIdentifier)&&bn(n.createLong),zu=typeof SharedArrayBuffer<"u"?SharedArrayBuffer:ArrayBuffer;function yg(n){const t=n[0]?[n[0]]:[];let e,i,r,s;for(let o,a,c=0,l=0,u=n.length;++c<u;){if(o=t[l],a=n[c],!o||!a||o.buffer!==a.buffer||a.byteOffset<o.byteOffset){a&&(t[++l]=a);continue}if({byteOffset:e,byteLength:r}=o,{byteOffset:i,byteLength:s}=a,e+r<i||i+s<e){a&&(t[++l]=a);continue}t[l]=new Uint8Array(o.buffer,e,i-e+s)}return t}function zh(n,t,e=0,i=t.byteLength){const r=n.byteLength,s=new Uint8Array(n.buffer,n.byteOffset,r),o=new Uint8Array(t.buffer,t.byteOffset,Math.min(i,r));return s.set(o,e),n}function Ii(n,t){const e=yg(n),i=e.reduce((u,h)=>u+h.byteLength,0);let r,s,o,a=0,c=-1;const l=Math.min(t||Number.POSITIVE_INFINITY,i);for(const u=e.length;++c<u;){if(r=e[c],s=r.subarray(0,Math.min(r.length,l-a)),l<=a+s.length){s.length<r.length?e[c]=r.subarray(s.length):s.length===r.length&&c++,o?zh(o,s,a):o=s;break}zh(o||(o=new Uint8Array(l)),s,a),a+=s.length}return[o||new Uint8Array(0),e.slice(c),i-(o?o.byteLength:0)]}function _e(n,t){let e=Ff(t)?t.value:t;return e instanceof n?n===Uint8Array?new n(e.buffer,e.byteOffset,e.byteLength):e:e?(typeof e=="string"&&(e=Nu(e)),e instanceof ArrayBuffer?new n(e):e instanceof zu?new n(e):vg(e)?_e(n,e.bytes()):ArrayBuffer.isView(e)?e.byteLength<=0?new n(0):new n(e.buffer,e.byteOffset,e.byteLength/n.BYTES_PER_ELEMENT):n.from(e)):new n(0)}const no=n=>_e(Int32Array,n),Vh=n=>_e(BigInt64Array,n),ce=n=>_e(Uint8Array,n),Ul=n=>(n.next(),n);function*bg(n,t){const e=function*(r){yield r},i=typeof t=="string"||ArrayBuffer.isView(t)||t instanceof ArrayBuffer||t instanceof zu?e(t):Rc(t)?t:e(t);return yield*Ul((function*(r){let s=null;do s=r.next(yield _e(n,s));while(!s.done)})(i[Symbol.iterator]())),new n}const Sg=n=>bg(Uint8Array,n);function Vf(n,t){return Ti(this,arguments,function*(){if(Ro(t))return yield Jt(yield Jt(yield*Ia(Es(Vf(n,yield Jt(t))))));const i=function(o){return Ti(this,arguments,function*(){yield yield Jt(yield Jt(o))})},r=function(o){return Ti(this,arguments,function*(){yield Jt(yield*Ia(Es(Ul((function*(a){let c=null;do c=a.next(yield c?.value);while(!c.done)})(o[Symbol.iterator]())))))})},s=typeof t=="string"||ArrayBuffer.isView(t)||t instanceof ArrayBuffer||t instanceof zu?i(t):Rc(t)?r(t):Bu(t)?t:i(t);return yield Jt(yield*Ia(Es(Ul((function(o){return Ti(this,arguments,function*(){let a=null;do a=yield Jt(o.next(yield yield Jt(_e(n,a))));while(!a.done)})})(s[Symbol.asyncIterator]()))))),yield Jt(new n)})}const Mg=n=>Vf(Uint8Array,n);function wg(n,t){let e=0;const i=n.length;if(i!==t.length)return!1;if(i>0)do if(n[e]!==t[e])return!1;while(++e<i);return!0}const $n={fromIterable(n){return ea(Ag(n))},fromAsyncIterable(n){return ea(Eg(n))},fromDOMStream(n){return ea(Tg(n))},fromNodeStream(n){return ea(Rg(n))},toDOMStream(n,t){throw new Error('"toDOMStream" not available in this environment')},toNodeStream(n,t){throw new Error('"toNodeStream" not available in this environment')}},ea=n=>(n.next(),n);function*Ag(n){let t,e=!1,i=[],r,s,o,a=0;function c(){return s==="peek"?Ii(i,o)[0]:([r,i,a]=Ii(i,o),r)}({cmd:s,size:o}=(yield null)||{cmd:"read",size:0});const l=Sg(n)[Symbol.iterator]();try{do if({done:t,value:r}=Number.isNaN(o-a)?l.next():l.next(o-a),!t&&r.byteLength>0&&(i.push(r),a+=r.byteLength),t||o<=a)do({cmd:s,size:o}=yield c());while(o<a);while(!t)}catch(u){e=!0,typeof l.throw=="function"&&l.throw(u)}finally{e===!1&&typeof l.return=="function"&&l.return(null)}return null}function Eg(n){return Ti(this,arguments,function*(){let e,i=!1,r=[],s,o,a,c=0;function l(){return o==="peek"?Ii(r,a)[0]:([s,r,c]=Ii(r,a),s)}({cmd:o,size:a}=(yield yield Jt(null))||{cmd:"read",size:0});const u=Mg(n)[Symbol.asyncIterator]();try{do if({done:e,value:s}=Number.isNaN(a-c)?yield Jt(u.next()):yield Jt(u.next(a-c)),!e&&s.byteLength>0&&(r.push(s),c+=s.byteLength),e||a<=c)do({cmd:o,size:a}=yield yield Jt(l()));while(a<c);while(!e)}catch(h){i=!0,typeof u.throw=="function"&&(yield Jt(u.throw(h)))}finally{i===!1&&typeof u.return=="function"&&(yield Jt(u.return(new Uint8Array(0))))}return yield Jt(null)})}function Tg(n){return Ti(this,arguments,function*(){let e=!1,i=!1,r=[],s,o,a,c=0;function l(){return o==="peek"?Ii(r,a)[0]:([s,r,c]=Ii(r,a),s)}({cmd:o,size:a}=(yield yield Jt(null))||{cmd:"read",size:0});const u=new Cg(n);try{do if({done:e,value:s}=Number.isNaN(a-c)?yield Jt(u.read()):yield Jt(u.read(a-c)),!e&&s.byteLength>0&&(r.push(ce(s)),c+=s.byteLength),e||a<=c)do({cmd:o,size:a}=yield yield Jt(l()));while(a<c);while(!e)}catch(h){i=!0,yield Jt(u.cancel(h))}finally{i===!1?yield Jt(u.cancel()):n.locked&&u.releaseLock()}return yield Jt(null)})}class Cg{constructor(t){this.source=t,this.reader=null,this.reader=this.source.getReader(),this.reader.closed.catch(()=>{})}get closed(){return this.reader?this.reader.closed.catch(()=>{}):Promise.resolve()}releaseLock(){this.reader&&this.reader.releaseLock(),this.reader=null}cancel(t){return Wt(this,void 0,void 0,function*(){const{reader:e,source:i}=this;e&&(yield e.cancel(t).catch(()=>{})),i&&i.locked&&this.releaseLock()})}read(t){return Wt(this,void 0,void 0,function*(){if(t===0)return{done:this.reader==null,value:new Uint8Array(0)};const e=yield this.reader.read();return!e.done&&(e.value=ce(e)),e})}}const qc=(n,t)=>{const e=r=>i([t,r]);let i;return[t,e,new Promise(r=>(i=r)&&n.once(t,e))]};function Rg(n){return Ti(this,arguments,function*(){const e=[];let i="error",r=!1,s=null,o,a,c=0,l=[],u;function h(){return o==="peek"?Ii(l,a)[0]:([u,l,c]=Ii(l,a),u)}if({cmd:o,size:a}=(yield yield Jt(null))||{cmd:"read",size:0},n.isTTY)return yield yield Jt(new Uint8Array(0)),yield Jt(null);try{e[0]=qc(n,"end"),e[1]=qc(n,"error");do{if(e[2]=qc(n,"readable"),[i,s]=yield Jt(Promise.race(e.map(f=>f[2]))),i==="error")break;if((r=i==="end")||(Number.isFinite(a-c)?(u=ce(n.read(a-c)),u.byteLength<a-c&&(u=ce(n.read()))):u=ce(n.read()),u.byteLength>0&&(l.push(u),c+=u.byteLength)),r||a<=c)do({cmd:o,size:a}=yield yield Jt(h()));while(a<c)}while(!r)}finally{yield Jt(d(e,i==="error"?s:null))}return yield Jt(null);function d(f,g){return u=l=null,new Promise((_,m)=>{for(const[p,A]of f)n.off(p,A);try{const p=n.destroy;p&&p.call(n,g),g=void 0}catch(p){g=p||g}finally{g!=null?m(g):_()}})}})}var $e;(function(n){n[n.V1=0]="V1",n[n.V2=1]="V2",n[n.V3=2]="V3",n[n.V4=3]="V4",n[n.V5=4]="V5"})($e||($e={}));var Dn;(function(n){n[n.Sparse=0]="Sparse",n[n.Dense=1]="Dense"})(Dn||(Dn={}));var mn;(function(n){n[n.HALF=0]="HALF",n[n.SINGLE=1]="SINGLE",n[n.DOUBLE=2]="DOUBLE"})(mn||(mn={}));var ti;(function(n){n[n.DAY=0]="DAY",n[n.MILLISECOND=1]="MILLISECOND"})(ti||(ti={}));var Nt;(function(n){n[n.SECOND=0]="SECOND",n[n.MILLISECOND=1]="MILLISECOND",n[n.MICROSECOND=2]="MICROSECOND",n[n.NANOSECOND=3]="NANOSECOND"})(Nt||(Nt={}));var ln;(function(n){n[n.YEAR_MONTH=0]="YEAR_MONTH",n[n.DAY_TIME=1]="DAY_TIME",n[n.MONTH_DAY_NANO=2]="MONTH_DAY_NANO"})(ln||(ln={}));const Yc=2,wi=4,Yi=4,me=4,dr=new Int32Array(2),kh=new Float32Array(dr.buffer),Hh=new Float64Array(dr.buffer),na=new Uint16Array(new Uint8Array([1,0]).buffer)[0]===1;var Fl;(function(n){n[n.UTF8_BYTES=1]="UTF8_BYTES",n[n.UTF16_STRING=2]="UTF16_STRING"})(Fl||(Fl={}));let zr=class kf{constructor(t){this.bytes_=t,this.position_=0,this.text_decoder_=new TextDecoder}static allocate(t){return new kf(new Uint8Array(t))}clear(){this.position_=0}bytes(){return this.bytes_}position(){return this.position_}setPosition(t){this.position_=t}capacity(){return this.bytes_.length}readInt8(t){return this.readUint8(t)<<24>>24}readUint8(t){return this.bytes_[t]}readInt16(t){return this.readUint16(t)<<16>>16}readUint16(t){return this.bytes_[t]|this.bytes_[t+1]<<8}readInt32(t){return this.bytes_[t]|this.bytes_[t+1]<<8|this.bytes_[t+2]<<16|this.bytes_[t+3]<<24}readUint32(t){return this.readInt32(t)>>>0}readInt64(t){return BigInt.asIntN(64,BigInt(this.readUint32(t))+(BigInt(this.readUint32(t+4))<<BigInt(32)))}readUint64(t){return BigInt.asUintN(64,BigInt(this.readUint32(t))+(BigInt(this.readUint32(t+4))<<BigInt(32)))}readFloat32(t){return dr[0]=this.readInt32(t),kh[0]}readFloat64(t){return dr[na?0:1]=this.readInt32(t),dr[na?1:0]=this.readInt32(t+4),Hh[0]}writeInt8(t,e){this.bytes_[t]=e}writeUint8(t,e){this.bytes_[t]=e}writeInt16(t,e){this.bytes_[t]=e,this.bytes_[t+1]=e>>8}writeUint16(t,e){this.bytes_[t]=e,this.bytes_[t+1]=e>>8}writeInt32(t,e){this.bytes_[t]=e,this.bytes_[t+1]=e>>8,this.bytes_[t+2]=e>>16,this.bytes_[t+3]=e>>24}writeUint32(t,e){this.bytes_[t]=e,this.bytes_[t+1]=e>>8,this.bytes_[t+2]=e>>16,this.bytes_[t+3]=e>>24}writeInt64(t,e){this.writeInt32(t,Number(BigInt.asIntN(32,e))),this.writeInt32(t+4,Number(BigInt.asIntN(32,e>>BigInt(32))))}writeUint64(t,e){this.writeUint32(t,Number(BigInt.asUintN(32,e))),this.writeUint32(t+4,Number(BigInt.asUintN(32,e>>BigInt(32))))}writeFloat32(t,e){kh[0]=e,this.writeInt32(t,dr[0])}writeFloat64(t,e){Hh[0]=e,this.writeInt32(t,dr[na?0:1]),this.writeInt32(t+4,dr[na?1:0])}getBufferIdentifier(){if(this.bytes_.length<this.position_+wi+Yi)throw new Error("FlatBuffers: ByteBuffer is too short to contain an identifier.");let t="";for(let e=0;e<Yi;e++)t+=String.fromCharCode(this.readInt8(this.position_+wi+e));return t}__offset(t,e){const i=t-this.readInt32(t);return e<this.readInt16(i)?this.readInt16(i+e):0}__union(t,e){return t.bb_pos=e+this.readInt32(e),t.bb=this,t}__string(t,e){t+=this.readInt32(t);const i=this.readInt32(t);t+=wi;const r=this.bytes_.subarray(t,t+i);return e===Fl.UTF8_BYTES?r:this.text_decoder_.decode(r)}__union_with_string(t,e){return typeof t=="string"?this.__string(e):this.__union(t,e)}__indirect(t){return t+this.readInt32(t)}__vector(t){return t+this.readInt32(t)+wi}__vector_len(t){return this.readInt32(t+this.readInt32(t))}__has_identifier(t){if(t.length!=Yi)throw new Error("FlatBuffers: file identifier must be length "+Yi);for(let e=0;e<Yi;e++)if(t.charCodeAt(e)!=this.readInt8(this.position()+wi+e))return!1;return!0}createScalarList(t,e){const i=[];for(let r=0;r<e;++r){const s=t(r);s!==null&&i.push(s)}return i}createObjList(t,e){const i=[];for(let r=0;r<e;++r){const s=t(r);s!==null&&i.push(s.unpack())}return i}},Hf=class Gf{constructor(t){this.minalign=1,this.vtable=null,this.vtable_in_use=0,this.isNested=!1,this.object_start=0,this.vtables=[],this.vector_num_elems=0,this.force_defaults=!1,this.string_maps=null,this.text_encoder=new TextEncoder;let e;t?e=t:e=1024,this.bb=zr.allocate(e),this.space=e}clear(){this.bb.clear(),this.space=this.bb.capacity(),this.minalign=1,this.vtable=null,this.vtable_in_use=0,this.isNested=!1,this.object_start=0,this.vtables=[],this.vector_num_elems=0,this.force_defaults=!1,this.string_maps=null}forceDefaults(t){this.force_defaults=t}dataBuffer(){return this.bb}asUint8Array(){return this.bb.bytes().subarray(this.bb.position(),this.bb.position()+this.offset())}prep(t,e){t>this.minalign&&(this.minalign=t);const i=~(this.bb.capacity()-this.space+e)+1&t-1;for(;this.space<i+t+e;){const r=this.bb.capacity();this.bb=Gf.growByteBuffer(this.bb),this.space+=this.bb.capacity()-r}this.pad(i)}pad(t){for(let e=0;e<t;e++)this.bb.writeInt8(--this.space,0)}writeInt8(t){this.bb.writeInt8(this.space-=1,t)}writeInt16(t){this.bb.writeInt16(this.space-=2,t)}writeInt32(t){this.bb.writeInt32(this.space-=4,t)}writeInt64(t){this.bb.writeInt64(this.space-=8,t)}writeFloat32(t){this.bb.writeFloat32(this.space-=4,t)}writeFloat64(t){this.bb.writeFloat64(this.space-=8,t)}addInt8(t){this.prep(1,0),this.writeInt8(t)}addInt16(t){this.prep(2,0),this.writeInt16(t)}addInt32(t){this.prep(4,0),this.writeInt32(t)}addInt64(t){this.prep(8,0),this.writeInt64(t)}addFloat32(t){this.prep(4,0),this.writeFloat32(t)}addFloat64(t){this.prep(8,0),this.writeFloat64(t)}addFieldInt8(t,e,i){(this.force_defaults||e!=i)&&(this.addInt8(e),this.slot(t))}addFieldInt16(t,e,i){(this.force_defaults||e!=i)&&(this.addInt16(e),this.slot(t))}addFieldInt32(t,e,i){(this.force_defaults||e!=i)&&(this.addInt32(e),this.slot(t))}addFieldInt64(t,e,i){(this.force_defaults||e!==i)&&(this.addInt64(e),this.slot(t))}addFieldFloat32(t,e,i){(this.force_defaults||e!=i)&&(this.addFloat32(e),this.slot(t))}addFieldFloat64(t,e,i){(this.force_defaults||e!=i)&&(this.addFloat64(e),this.slot(t))}addFieldOffset(t,e,i){(this.force_defaults||e!=i)&&(this.addOffset(e),this.slot(t))}addFieldStruct(t,e,i){e!=i&&(this.nested(e),this.slot(t))}nested(t){if(t!=this.offset())throw new TypeError("FlatBuffers: struct must be serialized inline.")}notNested(){if(this.isNested)throw new TypeError("FlatBuffers: object serialization must not be nested.")}slot(t){this.vtable!==null&&(this.vtable[t]=this.offset())}offset(){return this.bb.capacity()-this.space}static growByteBuffer(t){const e=t.capacity();if(e&3221225472)throw new Error("FlatBuffers: cannot grow buffer beyond 2 gigabytes.");const i=e<<1,r=zr.allocate(i);return r.setPosition(i-e),r.bytes().set(t.bytes(),i-e),r}addOffset(t){this.prep(wi,0),this.writeInt32(this.offset()-t+wi)}startObject(t){this.notNested(),this.vtable==null&&(this.vtable=[]),this.vtable_in_use=t;for(let e=0;e<t;e++)this.vtable[e]=0;this.isNested=!0,this.object_start=this.offset()}endObject(){if(this.vtable==null||!this.isNested)throw new Error("FlatBuffers: endObject called without startObject");this.addInt32(0);const t=this.offset();let e=this.vtable_in_use-1;for(;e>=0&&this.vtable[e]==0;e--);const i=e+1;for(;e>=0;e--)this.addInt16(this.vtable[e]!=0?t-this.vtable[e]:0);const r=2;this.addInt16(t-this.object_start);const s=(i+r)*Yc;this.addInt16(s);let o=0;const a=this.space;t:for(e=0;e<this.vtables.length;e++){const c=this.bb.capacity()-this.vtables[e];if(s==this.bb.readInt16(c)){for(let l=Yc;l<s;l+=Yc)if(this.bb.readInt16(a+l)!=this.bb.readInt16(c+l))continue t;o=this.vtables[e];break}}return o?(this.space=this.bb.capacity()-t,this.bb.writeInt32(this.space,o-t)):(this.vtables.push(this.offset()),this.bb.writeInt32(this.bb.capacity()-t,this.offset()-t)),this.isNested=!1,t}finish(t,e,i){const r=i?me:0;if(e){const s=e;if(this.prep(this.minalign,wi+Yi+r),s.length!=Yi)throw new TypeError("FlatBuffers: file identifier must be length "+Yi);for(let o=Yi-1;o>=0;o--)this.writeInt8(s.charCodeAt(o))}this.prep(this.minalign,wi+r),this.addOffset(t),r&&this.addInt32(this.bb.capacity()-this.space),this.bb.setPosition(this.space)}finishSizePrefixed(t,e){this.finish(t,e,!0)}requiredField(t,e){const i=this.bb.capacity()-t,r=i-this.bb.readInt32(i);if(!(e<this.bb.readInt16(r)&&this.bb.readInt16(r+e)!=0))throw new TypeError("FlatBuffers: field "+e+" must be set")}startVector(t,e,i){this.notNested(),this.vector_num_elems=e,this.prep(wi,t*e),this.prep(i,t*e)}endVector(){return this.writeInt32(this.vector_num_elems),this.offset()}createSharedString(t){if(!t)return 0;if(this.string_maps||(this.string_maps=new Map),this.string_maps.has(t))return this.string_maps.get(t);const e=this.createString(t);return this.string_maps.set(t,e),e}createString(t){if(t==null)return 0;let e;return t instanceof Uint8Array?e=t:e=this.text_encoder.encode(t),this.addInt8(0),this.startVector(1,e.length,1),this.bb.setPosition(this.space-=e.length),this.bb.bytes().set(e,this.space),this.endVector()}createByteVector(t){return t==null?0:(this.startVector(1,t.length,1),this.bb.setPosition(this.space-=t.length),this.bb.bytes().set(t,this.space),this.endVector())}createObjectOffset(t){return t===null?0:typeof t=="string"?this.createString(t):t.pack(this)}createObjectOffsetList(t){const e=[];for(let i=0;i<t.length;++i){const r=t[i];if(r!==null)e.push(this.createObjectOffset(r));else throw new TypeError("FlatBuffers: Argument for createObjectOffsetList cannot contain null.")}return e}createStructOffsetList(t,e){return e(this,t.length),this.createObjectOffsetList(t.slice().reverse()),this.endVector()}};var Io;(function(n){n[n.BUFFER=0]="BUFFER"})(Io||(Io={}));var Vr;(function(n){n[n.LZ4_FRAME=0]="LZ4_FRAME",n[n.ZSTD=1]="ZSTD"})(Vr||(Vr={}));let ho=class Pr{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsBodyCompression(t,e){return(e||new Pr).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsBodyCompression(t,e){return t.setPosition(t.position()+me),(e||new Pr).__init(t.readInt32(t.position())+t.position(),t)}codec(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt8(this.bb_pos+t):Vr.LZ4_FRAME}method(){const t=this.bb.__offset(this.bb_pos,6);return t?this.bb.readInt8(this.bb_pos+t):Io.BUFFER}static startBodyCompression(t){t.startObject(2)}static addCodec(t,e){t.addFieldInt8(0,e,Vr.LZ4_FRAME)}static addMethod(t,e){t.addFieldInt8(1,e,Io.BUFFER)}static endBodyCompression(t){return t.endObject()}static createBodyCompression(t,e,i){return Pr.startBodyCompression(t),Pr.addCodec(t,e),Pr.addMethod(t,i),Pr.endBodyCompression(t)}};class Wf{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}offset(){return this.bb.readInt64(this.bb_pos)}length(){return this.bb.readInt64(this.bb_pos+8)}static sizeOf(){return 16}static createBuffer(t,e,i){return t.prep(8,16),t.writeInt64(BigInt(i??0)),t.writeInt64(BigInt(e??0)),t.offset()}}let Xf=class{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}length(){return this.bb.readInt64(this.bb_pos)}nullCount(){return this.bb.readInt64(this.bb_pos+8)}static sizeOf(){return 16}static createFieldNode(t,e,i){return t.prep(8,16),t.writeInt64(BigInt(i??0)),t.writeInt64(BigInt(e??0)),t.offset()}},vi=class Nl{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsRecordBatch(t,e){return(e||new Nl).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsRecordBatch(t,e){return t.setPosition(t.position()+me),(e||new Nl).__init(t.readInt32(t.position())+t.position(),t)}length(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt64(this.bb_pos+t):BigInt("0")}nodes(t,e){const i=this.bb.__offset(this.bb_pos,6);return i?(e||new Xf).__init(this.bb.__vector(this.bb_pos+i)+t*16,this.bb):null}nodesLength(){const t=this.bb.__offset(this.bb_pos,6);return t?this.bb.__vector_len(this.bb_pos+t):0}buffers(t,e){const i=this.bb.__offset(this.bb_pos,8);return i?(e||new Wf).__init(this.bb.__vector(this.bb_pos+i)+t*16,this.bb):null}buffersLength(){const t=this.bb.__offset(this.bb_pos,8);return t?this.bb.__vector_len(this.bb_pos+t):0}compression(t){const e=this.bb.__offset(this.bb_pos,10);return e?(t||new ho).__init(this.bb.__indirect(this.bb_pos+e),this.bb):null}static startRecordBatch(t){t.startObject(4)}static addLength(t,e){t.addFieldInt64(0,e,BigInt("0"))}static addNodes(t,e){t.addFieldOffset(1,e,0)}static startNodesVector(t,e){t.startVector(16,e,8)}static addBuffers(t,e){t.addFieldOffset(2,e,0)}static startBuffersVector(t,e){t.startVector(16,e,8)}static addCompression(t,e){t.addFieldOffset(3,e,0)}static endRecordBatch(t){return t.endObject()}},ds=class Bl{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsDictionaryBatch(t,e){return(e||new Bl).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsDictionaryBatch(t,e){return t.setPosition(t.position()+me),(e||new Bl).__init(t.readInt32(t.position())+t.position(),t)}id(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt64(this.bb_pos+t):BigInt("0")}data(t){const e=this.bb.__offset(this.bb_pos,6);return e?(t||new vi).__init(this.bb.__indirect(this.bb_pos+e),this.bb):null}isDelta(){const t=this.bb.__offset(this.bb_pos,8);return t?!!this.bb.readInt8(this.bb_pos+t):!1}static startDictionaryBatch(t){t.startObject(3)}static addId(t,e){t.addFieldInt64(0,e,BigInt("0"))}static addData(t,e){t.addFieldOffset(1,e,0)}static addIsDelta(t,e){t.addFieldInt8(2,+e,0)}static endDictionaryBatch(t){return t.endObject()}};var Us;(function(n){n[n.Little=0]="Little",n[n.Big=1]="Big"})(Us||(Us={}));var Ya;(function(n){n[n.DenseArray=0]="DenseArray"})(Ya||(Ya={}));class kn{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsInt(t,e){return(e||new kn).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsInt(t,e){return t.setPosition(t.position()+me),(e||new kn).__init(t.readInt32(t.position())+t.position(),t)}bitWidth(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt32(this.bb_pos+t):0}isSigned(){const t=this.bb.__offset(this.bb_pos,6);return t?!!this.bb.readInt8(this.bb_pos+t):!1}static startInt(t){t.startObject(2)}static addBitWidth(t,e){t.addFieldInt32(0,e,0)}static addIsSigned(t,e){t.addFieldInt8(1,+e,0)}static endInt(t){return t.endObject()}static createInt(t,e,i){return kn.startInt(t),kn.addBitWidth(t,e),kn.addIsSigned(t,i),kn.endInt(t)}}class $i{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsDictionaryEncoding(t,e){return(e||new $i).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsDictionaryEncoding(t,e){return t.setPosition(t.position()+me),(e||new $i).__init(t.readInt32(t.position())+t.position(),t)}id(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt64(this.bb_pos+t):BigInt("0")}indexType(t){const e=this.bb.__offset(this.bb_pos,6);return e?(t||new kn).__init(this.bb.__indirect(this.bb_pos+e),this.bb):null}isOrdered(){const t=this.bb.__offset(this.bb_pos,8);return t?!!this.bb.readInt8(this.bb_pos+t):!1}dictionaryKind(){const t=this.bb.__offset(this.bb_pos,10);return t?this.bb.readInt16(this.bb_pos+t):Ya.DenseArray}static startDictionaryEncoding(t){t.startObject(4)}static addId(t,e){t.addFieldInt64(0,e,BigInt("0"))}static addIndexType(t,e){t.addFieldOffset(1,e,0)}static addIsOrdered(t,e){t.addFieldInt8(2,+e,0)}static addDictionaryKind(t,e){t.addFieldInt16(3,e,Ya.DenseArray)}static endDictionaryEncoding(t){return t.endObject()}}class Je{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsKeyValue(t,e){return(e||new Je).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsKeyValue(t,e){return t.setPosition(t.position()+me),(e||new Je).__init(t.readInt32(t.position())+t.position(),t)}key(t){const e=this.bb.__offset(this.bb_pos,4);return e?this.bb.__string(this.bb_pos+e,t):null}value(t){const e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__string(this.bb_pos+e,t):null}static startKeyValue(t){t.startObject(2)}static addKey(t,e){t.addFieldOffset(0,e,0)}static addValue(t,e){t.addFieldOffset(1,e,0)}static endKeyValue(t){return t.endObject()}static createKeyValue(t,e,i){return Je.startKeyValue(t),Je.addKey(t,e),Je.addValue(t,i),Je.endKeyValue(t)}}let Gh=class fo{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsBinary(t,e){return(e||new fo).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsBinary(t,e){return t.setPosition(t.position()+me),(e||new fo).__init(t.readInt32(t.position())+t.position(),t)}static startBinary(t){t.startObject(0)}static endBinary(t){return t.endObject()}static createBinary(t){return fo.startBinary(t),fo.endBinary(t)}},Wh=class po{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsBool(t,e){return(e||new po).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsBool(t,e){return t.setPosition(t.position()+me),(e||new po).__init(t.readInt32(t.position())+t.position(),t)}static startBool(t){t.startObject(0)}static endBool(t){return t.endObject()}static createBool(t){return po.startBool(t),po.endBool(t)}},Da=class fs{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsDate(t,e){return(e||new fs).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsDate(t,e){return t.setPosition(t.position()+me),(e||new fs).__init(t.readInt32(t.position())+t.position(),t)}unit(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt16(this.bb_pos+t):ti.MILLISECOND}static startDate(t){t.startObject(1)}static addUnit(t,e){t.addFieldInt16(0,e,ti.MILLISECOND)}static endDate(t){return t.endObject()}static createDate(t,e){return fs.startDate(t),fs.addUnit(t,e),fs.endDate(t)}},ps=class hr{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsDecimal(t,e){return(e||new hr).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsDecimal(t,e){return t.setPosition(t.position()+me),(e||new hr).__init(t.readInt32(t.position())+t.position(),t)}precision(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt32(this.bb_pos+t):0}scale(){const t=this.bb.__offset(this.bb_pos,6);return t?this.bb.readInt32(this.bb_pos+t):0}bitWidth(){const t=this.bb.__offset(this.bb_pos,8);return t?this.bb.readInt32(this.bb_pos+t):128}static startDecimal(t){t.startObject(3)}static addPrecision(t,e){t.addFieldInt32(0,e,0)}static addScale(t,e){t.addFieldInt32(1,e,0)}static addBitWidth(t,e){t.addFieldInt32(2,e,128)}static endDecimal(t){return t.endObject()}static createDecimal(t,e,i,r){return hr.startDecimal(t),hr.addPrecision(t,e),hr.addScale(t,i),hr.addBitWidth(t,r),hr.endDecimal(t)}},La=class ms{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsDuration(t,e){return(e||new ms).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsDuration(t,e){return t.setPosition(t.position()+me),(e||new ms).__init(t.readInt32(t.position())+t.position(),t)}unit(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt16(this.bb_pos+t):Nt.MILLISECOND}static startDuration(t){t.startObject(1)}static addUnit(t,e){t.addFieldInt16(0,e,Nt.MILLISECOND)}static endDuration(t){return t.endObject()}static createDuration(t,e){return ms.startDuration(t),ms.addUnit(t,e),ms.endDuration(t)}},Pa=class gs{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsFixedSizeBinary(t,e){return(e||new gs).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsFixedSizeBinary(t,e){return t.setPosition(t.position()+me),(e||new gs).__init(t.readInt32(t.position())+t.position(),t)}byteWidth(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt32(this.bb_pos+t):0}static startFixedSizeBinary(t){t.startObject(1)}static addByteWidth(t,e){t.addFieldInt32(0,e,0)}static endFixedSizeBinary(t){return t.endObject()}static createFixedSizeBinary(t,e){return gs.startFixedSizeBinary(t),gs.addByteWidth(t,e),gs.endFixedSizeBinary(t)}},Ua=class xs{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsFixedSizeList(t,e){return(e||new xs).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsFixedSizeList(t,e){return t.setPosition(t.position()+me),(e||new xs).__init(t.readInt32(t.position())+t.position(),t)}listSize(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt32(this.bb_pos+t):0}static startFixedSizeList(t){t.startObject(1)}static addListSize(t,e){t.addFieldInt32(0,e,0)}static endFixedSizeList(t){return t.endObject()}static createFixedSizeList(t,e){return xs.startFixedSizeList(t),xs.addListSize(t,e),xs.endFixedSizeList(t)}};class Ai{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsFloatingPoint(t,e){return(e||new Ai).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsFloatingPoint(t,e){return t.setPosition(t.position()+me),(e||new Ai).__init(t.readInt32(t.position())+t.position(),t)}precision(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt16(this.bb_pos+t):mn.HALF}static startFloatingPoint(t){t.startObject(1)}static addPrecision(t,e){t.addFieldInt16(0,e,mn.HALF)}static endFloatingPoint(t){return t.endObject()}static createFloatingPoint(t,e){return Ai.startFloatingPoint(t),Ai.addPrecision(t,e),Ai.endFloatingPoint(t)}}class Ei{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsInterval(t,e){return(e||new Ei).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsInterval(t,e){return t.setPosition(t.position()+me),(e||new Ei).__init(t.readInt32(t.position())+t.position(),t)}unit(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt16(this.bb_pos+t):ln.YEAR_MONTH}static startInterval(t){t.startObject(1)}static addUnit(t,e){t.addFieldInt16(0,e,ln.YEAR_MONTH)}static endInterval(t){return t.endObject()}static createInterval(t,e){return Ei.startInterval(t),Ei.addUnit(t,e),Ei.endInterval(t)}}let Xh=class mo{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsLargeBinary(t,e){return(e||new mo).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsLargeBinary(t,e){return t.setPosition(t.position()+me),(e||new mo).__init(t.readInt32(t.position())+t.position(),t)}static startLargeBinary(t){t.startObject(0)}static endLargeBinary(t){return t.endObject()}static createLargeBinary(t){return mo.startLargeBinary(t),mo.endLargeBinary(t)}},qh=class go{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsLargeUtf8(t,e){return(e||new go).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsLargeUtf8(t,e){return t.setPosition(t.position()+me),(e||new go).__init(t.readInt32(t.position())+t.position(),t)}static startLargeUtf8(t){t.startObject(0)}static endLargeUtf8(t){return t.endObject()}static createLargeUtf8(t){return go.startLargeUtf8(t),go.endLargeUtf8(t)}},Yh=class xo{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsList(t,e){return(e||new xo).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsList(t,e){return t.setPosition(t.position()+me),(e||new xo).__init(t.readInt32(t.position())+t.position(),t)}static startList(t){t.startObject(0)}static endList(t){return t.endObject()}static createList(t){return xo.startList(t),xo.endList(t)}},Fa=class _s{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsMap(t,e){return(e||new _s).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsMap(t,e){return t.setPosition(t.position()+me),(e||new _s).__init(t.readInt32(t.position())+t.position(),t)}keysSorted(){const t=this.bb.__offset(this.bb_pos,4);return t?!!this.bb.readInt8(this.bb_pos+t):!1}static startMap(t){t.startObject(1)}static addKeysSorted(t,e){t.addFieldInt8(0,+e,0)}static endMap(t){return t.endObject()}static createMap(t,e){return _s.startMap(t),_s.addKeysSorted(t,e),_s.endMap(t)}},$h=class _o{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsNull(t,e){return(e||new _o).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsNull(t,e){return t.setPosition(t.position()+me),(e||new _o).__init(t.readInt32(t.position())+t.position(),t)}static startNull(t){t.startObject(0)}static endNull(t){return t.endObject()}static createNull(t){return _o.startNull(t),_o.endNull(t)}};class Br{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsStruct_(t,e){return(e||new Br).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsStruct_(t,e){return t.setPosition(t.position()+me),(e||new Br).__init(t.readInt32(t.position())+t.position(),t)}static startStruct_(t){t.startObject(0)}static endStruct_(t){return t.endObject()}static createStruct_(t){return Br.startStruct_(t),Br.endStruct_(t)}}class jn{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsTime(t,e){return(e||new jn).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsTime(t,e){return t.setPosition(t.position()+me),(e||new jn).__init(t.readInt32(t.position())+t.position(),t)}unit(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt16(this.bb_pos+t):Nt.MILLISECOND}bitWidth(){const t=this.bb.__offset(this.bb_pos,6);return t?this.bb.readInt32(this.bb_pos+t):32}static startTime(t){t.startObject(2)}static addUnit(t,e){t.addFieldInt16(0,e,Nt.MILLISECOND)}static addBitWidth(t,e){t.addFieldInt32(1,e,32)}static endTime(t){return t.endObject()}static createTime(t,e,i){return jn.startTime(t),jn.addUnit(t,e),jn.addBitWidth(t,i),jn.endTime(t)}}class Jn{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsTimestamp(t,e){return(e||new Jn).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsTimestamp(t,e){return t.setPosition(t.position()+me),(e||new Jn).__init(t.readInt32(t.position())+t.position(),t)}unit(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt16(this.bb_pos+t):Nt.SECOND}timezone(t){const e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__string(this.bb_pos+e,t):null}static startTimestamp(t){t.startObject(2)}static addUnit(t,e){t.addFieldInt16(0,e,Nt.SECOND)}static addTimezone(t,e){t.addFieldOffset(1,e,0)}static endTimestamp(t){return t.endObject()}static createTimestamp(t,e,i){return Jn.startTimestamp(t),Jn.addUnit(t,e),Jn.addTimezone(t,i),Jn.endTimestamp(t)}}class In{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsUnion(t,e){return(e||new In).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsUnion(t,e){return t.setPosition(t.position()+me),(e||new In).__init(t.readInt32(t.position())+t.position(),t)}mode(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt16(this.bb_pos+t):Dn.Sparse}typeIds(t){const e=this.bb.__offset(this.bb_pos,6);return e?this.bb.readInt32(this.bb.__vector(this.bb_pos+e)+t*4):0}typeIdsLength(){const t=this.bb.__offset(this.bb_pos,6);return t?this.bb.__vector_len(this.bb_pos+t):0}typeIdsArray(){const t=this.bb.__offset(this.bb_pos,6);return t?new Int32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+t),this.bb.__vector_len(this.bb_pos+t)):null}static startUnion(t){t.startObject(2)}static addMode(t,e){t.addFieldInt16(0,e,Dn.Sparse)}static addTypeIds(t,e){t.addFieldOffset(1,e,0)}static createTypeIdsVector(t,e){t.startVector(4,e.length,4);for(let i=e.length-1;i>=0;i--)t.addInt32(e[i]);return t.endVector()}static startTypeIdsVector(t,e){t.startVector(4,e,4)}static endUnion(t){return t.endObject()}static createUnion(t,e,i){return In.startUnion(t),In.addMode(t,e),In.addTypeIds(t,i),In.endUnion(t)}}let jh=class vo{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsUtf8(t,e){return(e||new vo).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsUtf8(t,e){return t.setPosition(t.position()+me),(e||new vo).__init(t.readInt32(t.position())+t.position(),t)}static startUtf8(t){t.startObject(0)}static endUtf8(t){return t.endObject()}static createUtf8(t){return vo.startUtf8(t),vo.endUtf8(t)}};var Ie;(function(n){n[n.NONE=0]="NONE",n[n.Null=1]="Null",n[n.Int=2]="Int",n[n.FloatingPoint=3]="FloatingPoint",n[n.Binary=4]="Binary",n[n.Utf8=5]="Utf8",n[n.Bool=6]="Bool",n[n.Decimal=7]="Decimal",n[n.Date=8]="Date",n[n.Time=9]="Time",n[n.Timestamp=10]="Timestamp",n[n.Interval=11]="Interval",n[n.List=12]="List",n[n.Struct_=13]="Struct_",n[n.Union=14]="Union",n[n.FixedSizeBinary=15]="FixedSizeBinary",n[n.FixedSizeList=16]="FixedSizeList",n[n.Map=17]="Map",n[n.Duration=18]="Duration",n[n.LargeBinary=19]="LargeBinary",n[n.LargeUtf8=20]="LargeUtf8",n[n.LargeList=21]="LargeList",n[n.RunEndEncoded=22]="RunEndEncoded"})(Ie||(Ie={}));let Yn=class Na{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsField(t,e){return(e||new Na).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsField(t,e){return t.setPosition(t.position()+me),(e||new Na).__init(t.readInt32(t.position())+t.position(),t)}name(t){const e=this.bb.__offset(this.bb_pos,4);return e?this.bb.__string(this.bb_pos+e,t):null}nullable(){const t=this.bb.__offset(this.bb_pos,6);return t?!!this.bb.readInt8(this.bb_pos+t):!1}typeType(){const t=this.bb.__offset(this.bb_pos,8);return t?this.bb.readUint8(this.bb_pos+t):Ie.NONE}type(t){const e=this.bb.__offset(this.bb_pos,10);return e?this.bb.__union(t,this.bb_pos+e):null}dictionary(t){const e=this.bb.__offset(this.bb_pos,12);return e?(t||new $i).__init(this.bb.__indirect(this.bb_pos+e),this.bb):null}children(t,e){const i=this.bb.__offset(this.bb_pos,14);return i?(e||new Na).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+t*4),this.bb):null}childrenLength(){const t=this.bb.__offset(this.bb_pos,14);return t?this.bb.__vector_len(this.bb_pos+t):0}customMetadata(t,e){const i=this.bb.__offset(this.bb_pos,16);return i?(e||new Je).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+t*4),this.bb):null}customMetadataLength(){const t=this.bb.__offset(this.bb_pos,16);return t?this.bb.__vector_len(this.bb_pos+t):0}static startField(t){t.startObject(7)}static addName(t,e){t.addFieldOffset(0,e,0)}static addNullable(t,e){t.addFieldInt8(1,+e,0)}static addTypeType(t,e){t.addFieldInt8(2,e,Ie.NONE)}static addType(t,e){t.addFieldOffset(3,e,0)}static addDictionary(t,e){t.addFieldOffset(4,e,0)}static addChildren(t,e){t.addFieldOffset(5,e,0)}static createChildrenVector(t,e){t.startVector(4,e.length,4);for(let i=e.length-1;i>=0;i--)t.addOffset(e[i]);return t.endVector()}static startChildrenVector(t,e){t.startVector(4,e,4)}static addCustomMetadata(t,e){t.addFieldOffset(6,e,0)}static createCustomMetadataVector(t,e){t.startVector(4,e.length,4);for(let i=e.length-1;i>=0;i--)t.addOffset(e[i]);return t.endVector()}static startCustomMetadataVector(t,e){t.startVector(4,e,4)}static endField(t){return t.endObject()}},yi=class ki{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsSchema(t,e){return(e||new ki).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsSchema(t,e){return t.setPosition(t.position()+me),(e||new ki).__init(t.readInt32(t.position())+t.position(),t)}endianness(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt16(this.bb_pos+t):Us.Little}fields(t,e){const i=this.bb.__offset(this.bb_pos,6);return i?(e||new Yn).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+t*4),this.bb):null}fieldsLength(){const t=this.bb.__offset(this.bb_pos,6);return t?this.bb.__vector_len(this.bb_pos+t):0}customMetadata(t,e){const i=this.bb.__offset(this.bb_pos,8);return i?(e||new Je).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+t*4),this.bb):null}customMetadataLength(){const t=this.bb.__offset(this.bb_pos,8);return t?this.bb.__vector_len(this.bb_pos+t):0}features(t){const e=this.bb.__offset(this.bb_pos,10);return e?this.bb.readInt64(this.bb.__vector(this.bb_pos+e)+t*8):BigInt(0)}featuresLength(){const t=this.bb.__offset(this.bb_pos,10);return t?this.bb.__vector_len(this.bb_pos+t):0}static startSchema(t){t.startObject(4)}static addEndianness(t,e){t.addFieldInt16(0,e,Us.Little)}static addFields(t,e){t.addFieldOffset(1,e,0)}static createFieldsVector(t,e){t.startVector(4,e.length,4);for(let i=e.length-1;i>=0;i--)t.addOffset(e[i]);return t.endVector()}static startFieldsVector(t,e){t.startVector(4,e,4)}static addCustomMetadata(t,e){t.addFieldOffset(2,e,0)}static createCustomMetadataVector(t,e){t.startVector(4,e.length,4);for(let i=e.length-1;i>=0;i--)t.addOffset(e[i]);return t.endVector()}static startCustomMetadataVector(t,e){t.startVector(4,e,4)}static addFeatures(t,e){t.addFieldOffset(3,e,0)}static createFeaturesVector(t,e){t.startVector(8,e.length,8);for(let i=e.length-1;i>=0;i--)t.addInt64(e[i]);return t.endVector()}static startFeaturesVector(t,e){t.startVector(8,e,8)}static endSchema(t){return t.endObject()}static finishSchemaBuffer(t,e){t.finish(e)}static finishSizePrefixedSchemaBuffer(t,e){t.finish(e,void 0,!0)}static createSchema(t,e,i,r,s){return ki.startSchema(t),ki.addEndianness(t,e),ki.addFields(t,i),ki.addCustomMetadata(t,r),ki.addFeatures(t,s),ki.endSchema(t)}};var fe;(function(n){n[n.NONE=0]="NONE",n[n.Schema=1]="Schema",n[n.DictionaryBatch=2]="DictionaryBatch",n[n.RecordBatch=3]="RecordBatch",n[n.Tensor=4]="Tensor",n[n.SparseTensor=5]="SparseTensor"})(fe||(fe={}));var P;(function(n){n[n.NONE=0]="NONE",n[n.Null=1]="Null",n[n.Int=2]="Int",n[n.Float=3]="Float",n[n.Binary=4]="Binary",n[n.Utf8=5]="Utf8",n[n.Bool=6]="Bool",n[n.Decimal=7]="Decimal",n[n.Date=8]="Date",n[n.Time=9]="Time",n[n.Timestamp=10]="Timestamp",n[n.Interval=11]="Interval",n[n.List=12]="List",n[n.Struct=13]="Struct",n[n.Union=14]="Union",n[n.FixedSizeBinary=15]="FixedSizeBinary",n[n.FixedSizeList=16]="FixedSizeList",n[n.Map=17]="Map",n[n.Duration=18]="Duration",n[n.LargeBinary=19]="LargeBinary",n[n.LargeUtf8=20]="LargeUtf8",n[n.Dictionary=-1]="Dictionary",n[n.Int8=-2]="Int8",n[n.Int16=-3]="Int16",n[n.Int32=-4]="Int32",n[n.Int64=-5]="Int64",n[n.Uint8=-6]="Uint8",n[n.Uint16=-7]="Uint16",n[n.Uint32=-8]="Uint32",n[n.Uint64=-9]="Uint64",n[n.Float16=-10]="Float16",n[n.Float32=-11]="Float32",n[n.Float64=-12]="Float64",n[n.DateDay=-13]="DateDay",n[n.DateMillisecond=-14]="DateMillisecond",n[n.TimestampSecond=-15]="TimestampSecond",n[n.TimestampMillisecond=-16]="TimestampMillisecond",n[n.TimestampMicrosecond=-17]="TimestampMicrosecond",n[n.TimestampNanosecond=-18]="TimestampNanosecond",n[n.TimeSecond=-19]="TimeSecond",n[n.TimeMillisecond=-20]="TimeMillisecond",n[n.TimeMicrosecond=-21]="TimeMicrosecond",n[n.TimeNanosecond=-22]="TimeNanosecond",n[n.DenseUnion=-23]="DenseUnion",n[n.SparseUnion=-24]="SparseUnion",n[n.IntervalDayTime=-25]="IntervalDayTime",n[n.IntervalYearMonth=-26]="IntervalYearMonth",n[n.DurationSecond=-27]="DurationSecond",n[n.DurationMillisecond=-28]="DurationMillisecond",n[n.DurationMicrosecond=-29]="DurationMicrosecond",n[n.DurationNanosecond=-30]="DurationNanosecond",n[n.IntervalMonthDayNano=-31]="IntervalMonthDayNano"})(P||(P={}));var Gi;(function(n){n[n.OFFSET=0]="OFFSET",n[n.DATA=1]="DATA",n[n.VALIDITY=2]="VALIDITY",n[n.TYPE=3]="TYPE"})(Gi||(Gi={}));const Ig=void 0;function Do(n){if(n===null)return"null";if(n===Ig)return"undefined";switch(typeof n){case"number":return`${n}`;case"bigint":return`${n}`;case"string":return`"${n}"`}return typeof n[Symbol.toPrimitive]=="function"?n[Symbol.toPrimitive]("string"):ArrayBuffer.isView(n)?n instanceof BigInt64Array||n instanceof BigUint64Array?`[${[...n].map(t=>Do(t))}]`:`[${n}]`:ArrayBuffer.isView(n)?`[${n}]`:JSON.stringify(n,(t,e)=>typeof e=="bigint"?`${e}`:e)}function Be(n){if(typeof n=="bigint"&&(n<Number.MIN_SAFE_INTEGER||n>Number.MAX_SAFE_INTEGER))throw new TypeError(`${n} is not safe to convert to a number.`);return Number(n)}function qf(n,t){return Be(n/t)+Be(n%t)/Be(t)}const Dg=Symbol.for("isArrowBigNum");function mi(n,...t){return t.length===0?Object.setPrototypeOf(_e(this.TypedArray,n),this.constructor.prototype):Object.setPrototypeOf(new this.TypedArray(n,...t),this.constructor.prototype)}mi.prototype[Dg]=!0;mi.prototype.toJSON=function(){return`"${Po(this)}"`};mi.prototype.valueOf=function(n){return Yf(this,n)};mi.prototype.toString=function(){return Po(this)};mi.prototype[Symbol.toPrimitive]=function(n="default"){switch(n){case"number":return Yf(this);case"string":return Po(this);case"default":return Ug(this)}return Po(this)};function Ts(...n){return mi.apply(this,n)}function Cs(...n){return mi.apply(this,n)}function Lo(...n){return mi.apply(this,n)}Object.setPrototypeOf(Ts.prototype,Object.create(Int32Array.prototype));Object.setPrototypeOf(Cs.prototype,Object.create(Uint32Array.prototype));Object.setPrototypeOf(Lo.prototype,Object.create(Uint32Array.prototype));Object.assign(Ts.prototype,mi.prototype,{constructor:Ts,signed:!0,TypedArray:Int32Array,BigIntArray:BigInt64Array});Object.assign(Cs.prototype,mi.prototype,{constructor:Cs,signed:!1,TypedArray:Uint32Array,BigIntArray:BigUint64Array});Object.assign(Lo.prototype,mi.prototype,{constructor:Lo,signed:!0,TypedArray:Uint32Array,BigIntArray:BigUint64Array});const Lg=BigInt(4294967296)*BigInt(4294967296),Pg=Lg-BigInt(1);function Yf(n,t){const{buffer:e,byteOffset:i,byteLength:r,signed:s}=n,o=new BigUint64Array(e,i,r/8),a=s&&o.at(-1)&BigInt(1)<<BigInt(63);let c=BigInt(0),l=0;if(a){for(const u of o)c|=(u^Pg)*(BigInt(1)<<BigInt(64*l++));c*=BigInt(-1),c-=BigInt(1)}else for(const u of o)c|=u*(BigInt(1)<<BigInt(64*l++));if(typeof t=="number"&&t>0){const u=BigInt("1".padEnd(t+1,"0")),h=c/u,d=a?-(c%u):c%u,f=Be(h),g=`${d}`.padStart(t,"0");return+`${a&&f===0?"-":""}${f}.${g}`}return Be(c)}function Po(n){if(n.byteLength===8)return`${new n.BigIntArray(n.buffer,n.byteOffset,1)[0]}`;if(!n.signed)return $c(n);let t=new Uint16Array(n.buffer,n.byteOffset,n.byteLength/2);if(new Int16Array([t.at(-1)])[0]>=0)return $c(n);t=t.slice();let i=1;for(let s=0;s<t.length;s++){const o=t[s],a=~o+i;t[s]=a,i&=o===0?1:0}return`-${$c(t)}`}function Ug(n){return n.byteLength===8?new n.BigIntArray(n.buffer,n.byteOffset,1)[0]:Po(n)}function $c(n){let t="";const e=new Uint32Array(2);let i=new Uint16Array(n.buffer,n.byteOffset,n.byteLength/2);const r=new Uint32Array((i=new Uint16Array(i).reverse()).buffer);let s=-1;const o=i.length-1;do{for(e[0]=i[s=0];s<o;)i[s++]=e[1]=e[0]/10,e[0]=(e[0]-e[1]*10<<16)+i[s];i[s]=e[1]=e[0]/10,e[0]=e[0]-e[1]*10,t=`${e[0]}${t}`}while(r[0]||r[1]||r[2]||r[3]);return t??"0"}class Vu{static new(t,e){switch(e){case!0:return new Ts(t);case!1:return new Cs(t)}switch(t.constructor){case Int8Array:case Int16Array:case Int32Array:case BigInt64Array:return new Ts(t)}return t.byteLength===16?new Lo(t):new Cs(t)}static signed(t){return new Ts(t)}static unsigned(t){return new Cs(t)}static decimal(t){return new Lo(t)}constructor(t,e){return Vu.new(t,e)}}var $f,jf,Jf,Kf,Zf,Qf,tp,ep,np,ip,rp,sp,op,ap,cp,lp,up,hp,dp,fp,pp,mp;class yt{static isNull(t){return t?.typeId===P.Null}static isInt(t){return t?.typeId===P.Int}static isFloat(t){return t?.typeId===P.Float}static isBinary(t){return t?.typeId===P.Binary}static isLargeBinary(t){return t?.typeId===P.LargeBinary}static isUtf8(t){return t?.typeId===P.Utf8}static isLargeUtf8(t){return t?.typeId===P.LargeUtf8}static isBool(t){return t?.typeId===P.Bool}static isDecimal(t){return t?.typeId===P.Decimal}static isDate(t){return t?.typeId===P.Date}static isTime(t){return t?.typeId===P.Time}static isTimestamp(t){return t?.typeId===P.Timestamp}static isInterval(t){return t?.typeId===P.Interval}static isDuration(t){return t?.typeId===P.Duration}static isList(t){return t?.typeId===P.List}static isStruct(t){return t?.typeId===P.Struct}static isUnion(t){return t?.typeId===P.Union}static isFixedSizeBinary(t){return t?.typeId===P.FixedSizeBinary}static isFixedSizeList(t){return t?.typeId===P.FixedSizeList}static isMap(t){return t?.typeId===P.Map}static isDictionary(t){return t?.typeId===P.Dictionary}static isDenseUnion(t){return yt.isUnion(t)&&t.mode===Dn.Dense}static isSparseUnion(t){return yt.isUnion(t)&&t.mode===Dn.Sparse}constructor(t){this.typeId=t}}$f=Symbol.toStringTag;yt[$f]=(n=>(n.children=null,n.ArrayType=Array,n.OffsetArrayType=Int32Array,n[Symbol.toStringTag]="DataType"))(yt.prototype);class vr extends yt{constructor(){super(P.Null)}toString(){return"Null"}}jf=Symbol.toStringTag;vr[jf]=(n=>n[Symbol.toStringTag]="Null")(vr.prototype);class kr extends yt{constructor(t,e){super(P.Int),this.isSigned=t,this.bitWidth=e}get ArrayType(){switch(this.bitWidth){case 8:return this.isSigned?Int8Array:Uint8Array;case 16:return this.isSigned?Int16Array:Uint16Array;case 32:return this.isSigned?Int32Array:Uint32Array;case 64:return this.isSigned?BigInt64Array:BigUint64Array}throw new Error(`Unrecognized ${this[Symbol.toStringTag]} type`)}toString(){return`${this.isSigned?"I":"Ui"}nt${this.bitWidth}`}}Jf=Symbol.toStringTag;kr[Jf]=(n=>(n.isSigned=null,n.bitWidth=null,n[Symbol.toStringTag]="Int"))(kr.prototype);class Uo extends kr{constructor(){super(!0,32)}get ArrayType(){return Int32Array}}Object.defineProperty(Uo.prototype,"ArrayType",{value:Int32Array});class $a extends yt{constructor(t){super(P.Float),this.precision=t}get ArrayType(){switch(this.precision){case mn.HALF:return Uint16Array;case mn.SINGLE:return Float32Array;case mn.DOUBLE:return Float64Array}throw new Error(`Unrecognized ${this[Symbol.toStringTag]} type`)}toString(){return`Float${this.precision<<5||16}`}}Kf=Symbol.toStringTag;$a[Kf]=(n=>(n.precision=null,n[Symbol.toStringTag]="Float"))($a.prototype);class ja extends yt{constructor(){super(P.Binary)}toString(){return"Binary"}}Zf=Symbol.toStringTag;ja[Zf]=(n=>(n.ArrayType=Uint8Array,n[Symbol.toStringTag]="Binary"))(ja.prototype);class Ja extends yt{constructor(){super(P.LargeBinary)}toString(){return"LargeBinary"}}Qf=Symbol.toStringTag;Ja[Qf]=(n=>(n.ArrayType=Uint8Array,n.OffsetArrayType=BigInt64Array,n[Symbol.toStringTag]="LargeBinary"))(Ja.prototype);class Ka extends yt{constructor(){super(P.Utf8)}toString(){return"Utf8"}}tp=Symbol.toStringTag;Ka[tp]=(n=>(n.ArrayType=Uint8Array,n[Symbol.toStringTag]="Utf8"))(Ka.prototype);class Za extends yt{constructor(){super(P.LargeUtf8)}toString(){return"LargeUtf8"}}ep=Symbol.toStringTag;Za[ep]=(n=>(n.ArrayType=Uint8Array,n.OffsetArrayType=BigInt64Array,n[Symbol.toStringTag]="LargeUtf8"))(Za.prototype);class Qa extends yt{constructor(){super(P.Bool)}toString(){return"Bool"}}np=Symbol.toStringTag;Qa[np]=(n=>(n.ArrayType=Uint8Array,n[Symbol.toStringTag]="Bool"))(Qa.prototype);class tc extends yt{constructor(t,e,i=128){super(P.Decimal),this.scale=t,this.precision=e,this.bitWidth=i}toString(){return`Decimal[${this.precision}e${this.scale>0?"+":""}${this.scale}]`}}ip=Symbol.toStringTag;tc[ip]=(n=>(n.scale=null,n.precision=null,n.ArrayType=Uint32Array,n[Symbol.toStringTag]="Decimal"))(tc.prototype);class ec extends yt{constructor(t){super(P.Date),this.unit=t}toString(){return`Date${(this.unit+1)*32}<${ti[this.unit]}>`}get ArrayType(){return this.unit===ti.DAY?Int32Array:BigInt64Array}}rp=Symbol.toStringTag;ec[rp]=(n=>(n.unit=null,n[Symbol.toStringTag]="Date"))(ec.prototype);class nc extends yt{constructor(t,e){super(P.Time),this.unit=t,this.bitWidth=e}toString(){return`Time${this.bitWidth}<${Nt[this.unit]}>`}get ArrayType(){switch(this.bitWidth){case 32:return Int32Array;case 64:return BigInt64Array}throw new Error(`Unrecognized ${this[Symbol.toStringTag]} type`)}}sp=Symbol.toStringTag;nc[sp]=(n=>(n.unit=null,n.bitWidth=null,n[Symbol.toStringTag]="Time"))(nc.prototype);class ic extends yt{constructor(t,e){super(P.Timestamp),this.unit=t,this.timezone=e}toString(){return`Timestamp<${Nt[this.unit]}${this.timezone?`, ${this.timezone}`:""}>`}}op=Symbol.toStringTag;ic[op]=(n=>(n.unit=null,n.timezone=null,n.ArrayType=BigInt64Array,n[Symbol.toStringTag]="Timestamp"))(ic.prototype);class rc extends yt{constructor(t){super(P.Interval),this.unit=t}toString(){return`Interval<${ln[this.unit]}>`}}ap=Symbol.toStringTag;rc[ap]=(n=>(n.unit=null,n.ArrayType=Int32Array,n[Symbol.toStringTag]="Interval"))(rc.prototype);class sc extends yt{constructor(t){super(P.Duration),this.unit=t}toString(){return`Duration<${Nt[this.unit]}>`}}cp=Symbol.toStringTag;sc[cp]=(n=>(n.unit=null,n.ArrayType=BigInt64Array,n[Symbol.toStringTag]="Duration"))(sc.prototype);class oc extends yt{constructor(t){super(P.List),this.children=[t]}toString(){return`List<${this.valueType}>`}get valueType(){return this.children[0].type}get valueField(){return this.children[0]}get ArrayType(){return this.valueType.ArrayType}}lp=Symbol.toStringTag;oc[lp]=(n=>(n.children=null,n[Symbol.toStringTag]="List"))(oc.prototype);class Sn extends yt{constructor(t){super(P.Struct),this.children=t}toString(){return`Struct<{${this.children.map(t=>`${t.name}:${t.type}`).join(", ")}}>`}}up=Symbol.toStringTag;Sn[up]=(n=>(n.children=null,n[Symbol.toStringTag]="Struct"))(Sn.prototype);class ac extends yt{constructor(t,e,i){super(P.Union),this.mode=t,this.children=i,this.typeIds=e=Int32Array.from(e),this.typeIdToChildIndex=e.reduce((r,s,o)=>(r[s]=o)&&r||r,Object.create(null))}toString(){return`${this[Symbol.toStringTag]}<${this.children.map(t=>`${t.type}`).join(" | ")}>`}}hp=Symbol.toStringTag;ac[hp]=(n=>(n.mode=null,n.typeIds=null,n.children=null,n.typeIdToChildIndex=null,n.ArrayType=Int8Array,n[Symbol.toStringTag]="Union"))(ac.prototype);class cc extends yt{constructor(t){super(P.FixedSizeBinary),this.byteWidth=t}toString(){return`FixedSizeBinary[${this.byteWidth}]`}}dp=Symbol.toStringTag;cc[dp]=(n=>(n.byteWidth=null,n.ArrayType=Uint8Array,n[Symbol.toStringTag]="FixedSizeBinary"))(cc.prototype);class lc extends yt{constructor(t,e){super(P.FixedSizeList),this.listSize=t,this.children=[e]}get valueType(){return this.children[0].type}get valueField(){return this.children[0]}get ArrayType(){return this.valueType.ArrayType}toString(){return`FixedSizeList[${this.listSize}]<${this.valueType}>`}}fp=Symbol.toStringTag;lc[fp]=(n=>(n.children=null,n.listSize=null,n[Symbol.toStringTag]="FixedSizeList"))(lc.prototype);class uc extends yt{constructor(t,e=!1){var i,r,s;if(super(P.Map),this.children=[t],this.keysSorted=e,t&&(t.name="entries",!((i=t?.type)===null||i===void 0)&&i.children)){const o=(r=t?.type)===null||r===void 0?void 0:r.children[0];o&&(o.name="key");const a=(s=t?.type)===null||s===void 0?void 0:s.children[1];a&&(a.name="value")}}get keyType(){return this.children[0].type.children[0].type}get valueType(){return this.children[0].type.children[1].type}get childType(){return this.children[0].type}toString(){return`Map<{${this.children[0].type.children.map(t=>`${t.name}:${t.type}`).join(", ")}}>`}}pp=Symbol.toStringTag;uc[pp]=(n=>(n.children=null,n.keysSorted=null,n[Symbol.toStringTag]="Map_"))(uc.prototype);const Fg=(n=>()=>++n)(-1);class Fs extends yt{constructor(t,e,i,r){super(P.Dictionary),this.indices=e,this.dictionary=t,this.isOrdered=r||!1,this.id=i==null?Fg():Be(i)}get children(){return this.dictionary.children}get valueType(){return this.dictionary}get ArrayType(){return this.dictionary.ArrayType}toString(){return`Dictionary<${this.indices}, ${this.dictionary}>`}}mp=Symbol.toStringTag;Fs[mp]=(n=>(n.id=null,n.indices=null,n.isOrdered=null,n.dictionary=null,n[Symbol.toStringTag]="Dictionary"))(Fs.prototype);function Wi(n){const t=n;switch(n.typeId){case P.Decimal:return n.bitWidth/32;case P.Interval:return t.unit===ln.MONTH_DAY_NANO?4:1+t.unit;case P.FixedSizeList:return t.listSize;case P.FixedSizeBinary:return t.byteWidth;default:return 1}}class Qt{visitMany(t,...e){return t.map((i,r)=>this.visit(i,...e.map(s=>s[r])))}visit(...t){return this.getVisitFn(t[0],!1).apply(this,t)}getVisitFn(t,e=!0){return Ng(this,t,e)}getVisitFnByTypeId(t,e=!0){return vs(this,t,e)}visitNull(t,...e){return null}visitBool(t,...e){return null}visitInt(t,...e){return null}visitFloat(t,...e){return null}visitUtf8(t,...e){return null}visitLargeUtf8(t,...e){return null}visitBinary(t,...e){return null}visitLargeBinary(t,...e){return null}visitFixedSizeBinary(t,...e){return null}visitDate(t,...e){return null}visitTimestamp(t,...e){return null}visitTime(t,...e){return null}visitDecimal(t,...e){return null}visitList(t,...e){return null}visitStruct(t,...e){return null}visitUnion(t,...e){return null}visitDictionary(t,...e){return null}visitInterval(t,...e){return null}visitDuration(t,...e){return null}visitFixedSizeList(t,...e){return null}visitMap(t,...e){return null}}function Ng(n,t,e=!0){return typeof t=="number"?vs(n,t,e):typeof t=="string"&&t in P?vs(n,P[t],e):t&&t instanceof yt?vs(n,Jh(t),e):t?.type&&t.type instanceof yt?vs(n,Jh(t.type),e):vs(n,P.NONE,e)}function vs(n,t,e=!0){let i=null;switch(t){case P.Null:i=n.visitNull;break;case P.Bool:i=n.visitBool;break;case P.Int:i=n.visitInt;break;case P.Int8:i=n.visitInt8||n.visitInt;break;case P.Int16:i=n.visitInt16||n.visitInt;break;case P.Int32:i=n.visitInt32||n.visitInt;break;case P.Int64:i=n.visitInt64||n.visitInt;break;case P.Uint8:i=n.visitUint8||n.visitInt;break;case P.Uint16:i=n.visitUint16||n.visitInt;break;case P.Uint32:i=n.visitUint32||n.visitInt;break;case P.Uint64:i=n.visitUint64||n.visitInt;break;case P.Float:i=n.visitFloat;break;case P.Float16:i=n.visitFloat16||n.visitFloat;break;case P.Float32:i=n.visitFloat32||n.visitFloat;break;case P.Float64:i=n.visitFloat64||n.visitFloat;break;case P.Utf8:i=n.visitUtf8;break;case P.LargeUtf8:i=n.visitLargeUtf8;break;case P.Binary:i=n.visitBinary;break;case P.LargeBinary:i=n.visitLargeBinary;break;case P.FixedSizeBinary:i=n.visitFixedSizeBinary;break;case P.Date:i=n.visitDate;break;case P.DateDay:i=n.visitDateDay||n.visitDate;break;case P.DateMillisecond:i=n.visitDateMillisecond||n.visitDate;break;case P.Timestamp:i=n.visitTimestamp;break;case P.TimestampSecond:i=n.visitTimestampSecond||n.visitTimestamp;break;case P.TimestampMillisecond:i=n.visitTimestampMillisecond||n.visitTimestamp;break;case P.TimestampMicrosecond:i=n.visitTimestampMicrosecond||n.visitTimestamp;break;case P.TimestampNanosecond:i=n.visitTimestampNanosecond||n.visitTimestamp;break;case P.Time:i=n.visitTime;break;case P.TimeSecond:i=n.visitTimeSecond||n.visitTime;break;case P.TimeMillisecond:i=n.visitTimeMillisecond||n.visitTime;break;case P.TimeMicrosecond:i=n.visitTimeMicrosecond||n.visitTime;break;case P.TimeNanosecond:i=n.visitTimeNanosecond||n.visitTime;break;case P.Decimal:i=n.visitDecimal;break;case P.List:i=n.visitList;break;case P.Struct:i=n.visitStruct;break;case P.Union:i=n.visitUnion;break;case P.DenseUnion:i=n.visitDenseUnion||n.visitUnion;break;case P.SparseUnion:i=n.visitSparseUnion||n.visitUnion;break;case P.Dictionary:i=n.visitDictionary;break;case P.Interval:i=n.visitInterval;break;case P.IntervalDayTime:i=n.visitIntervalDayTime||n.visitInterval;break;case P.IntervalYearMonth:i=n.visitIntervalYearMonth||n.visitInterval;break;case P.IntervalMonthDayNano:i=n.visitIntervalMonthDayNano||n.visitInterval;break;case P.Duration:i=n.visitDuration;break;case P.DurationSecond:i=n.visitDurationSecond||n.visitDuration;break;case P.DurationMillisecond:i=n.visitDurationMillisecond||n.visitDuration;break;case P.DurationMicrosecond:i=n.visitDurationMicrosecond||n.visitDuration;break;case P.DurationNanosecond:i=n.visitDurationNanosecond||n.visitDuration;break;case P.FixedSizeList:i=n.visitFixedSizeList;break;case P.Map:i=n.visitMap;break}if(typeof i=="function")return i;if(!e)return()=>null;throw new Error(`Unrecognized type '${P[t]}'`)}function Jh(n){switch(n.typeId){case P.Null:return P.Null;case P.Int:{const{bitWidth:t,isSigned:e}=n;switch(t){case 8:return e?P.Int8:P.Uint8;case 16:return e?P.Int16:P.Uint16;case 32:return e?P.Int32:P.Uint32;case 64:return e?P.Int64:P.Uint64}return P.Int}case P.Float:switch(n.precision){case mn.HALF:return P.Float16;case mn.SINGLE:return P.Float32;case mn.DOUBLE:return P.Float64}return P.Float;case P.Binary:return P.Binary;case P.LargeBinary:return P.LargeBinary;case P.Utf8:return P.Utf8;case P.LargeUtf8:return P.LargeUtf8;case P.Bool:return P.Bool;case P.Decimal:return P.Decimal;case P.Time:switch(n.unit){case Nt.SECOND:return P.TimeSecond;case Nt.MILLISECOND:return P.TimeMillisecond;case Nt.MICROSECOND:return P.TimeMicrosecond;case Nt.NANOSECOND:return P.TimeNanosecond}return P.Time;case P.Timestamp:switch(n.unit){case Nt.SECOND:return P.TimestampSecond;case Nt.MILLISECOND:return P.TimestampMillisecond;case Nt.MICROSECOND:return P.TimestampMicrosecond;case Nt.NANOSECOND:return P.TimestampNanosecond}return P.Timestamp;case P.Date:switch(n.unit){case ti.DAY:return P.DateDay;case ti.MILLISECOND:return P.DateMillisecond}return P.Date;case P.Interval:switch(n.unit){case ln.DAY_TIME:return P.IntervalDayTime;case ln.YEAR_MONTH:return P.IntervalYearMonth;case ln.MONTH_DAY_NANO:return P.IntervalMonthDayNano}return P.Interval;case P.Duration:switch(n.unit){case Nt.SECOND:return P.DurationSecond;case Nt.MILLISECOND:return P.DurationMillisecond;case Nt.MICROSECOND:return P.DurationMicrosecond;case Nt.NANOSECOND:return P.DurationNanosecond}return P.Duration;case P.Map:return P.Map;case P.List:return P.List;case P.Struct:return P.Struct;case P.Union:switch(n.mode){case Dn.Dense:return P.DenseUnion;case Dn.Sparse:return P.SparseUnion}return P.Union;case P.FixedSizeBinary:return P.FixedSizeBinary;case P.FixedSizeList:return P.FixedSizeList;case P.Dictionary:return P.Dictionary}throw new Error(`Unrecognized type '${P[n.typeId]}'`)}Qt.prototype.visitInt8=null;Qt.prototype.visitInt16=null;Qt.prototype.visitInt32=null;Qt.prototype.visitInt64=null;Qt.prototype.visitUint8=null;Qt.prototype.visitUint16=null;Qt.prototype.visitUint32=null;Qt.prototype.visitUint64=null;Qt.prototype.visitFloat16=null;Qt.prototype.visitFloat32=null;Qt.prototype.visitFloat64=null;Qt.prototype.visitDateDay=null;Qt.prototype.visitDateMillisecond=null;Qt.prototype.visitTimestampSecond=null;Qt.prototype.visitTimestampMillisecond=null;Qt.prototype.visitTimestampMicrosecond=null;Qt.prototype.visitTimestampNanosecond=null;Qt.prototype.visitTimeSecond=null;Qt.prototype.visitTimeMillisecond=null;Qt.prototype.visitTimeMicrosecond=null;Qt.prototype.visitTimeNanosecond=null;Qt.prototype.visitDenseUnion=null;Qt.prototype.visitSparseUnion=null;Qt.prototype.visitIntervalDayTime=null;Qt.prototype.visitIntervalYearMonth=null;Qt.prototype.visitIntervalMonthDayNano=null;Qt.prototype.visitDuration=null;Qt.prototype.visitDurationSecond=null;Qt.prototype.visitDurationMillisecond=null;Qt.prototype.visitDurationMicrosecond=null;Qt.prototype.visitDurationNanosecond=null;const gp=new Float64Array(1),Jr=new Uint32Array(gp.buffer);function xp(n){const t=(n&31744)>>10,e=(n&1023)/1024,i=Math.pow(-1,(n&32768)>>15);switch(t){case 31:return i*(e?Number.NaN:1/0);case 0:return i*(e?6103515625e-14*e:0)}return i*Math.pow(2,t-15)*(1+e)}function Bg(n){if(n!==n)return 32256;gp[0]=n;const t=(Jr[1]&2147483648)>>16&65535;let e=Jr[1]&2146435072,i=0;return e>=1089470464?Jr[0]>0?e=31744:(e=(e&2080374784)>>16,i=(Jr[1]&1048575)>>10):e<=1056964608?(i=1048576+(Jr[1]&1048575),i=1048576+(i<<(e>>20)-998)>>21,e=0):(e=e-1056964608>>10,i=(Jr[1]&1048575)+512>>10),t|e|i&65535}class Lt extends Qt{}function Bt(n){return(t,e,i)=>{if(t.setValid(e,i!=null))return n(t,e,i)}}const Og=(n,t,e)=>{n[t]=Math.floor(e/864e5)},_p=(n,t,e,i)=>{if(e+1<t.length){const r=Be(t[e]),s=Be(t[e+1]);n.set(i.subarray(0,s-r),r)}},zg=({offset:n,values:t},e,i)=>{const r=n+e;i?t[r>>3]|=1<<r%8:t[r>>3]&=~(1<<r%8)},nr=({values:n},t,e)=>{n[t]=e},ku=({values:n},t,e)=>{n[t]=e},vp=({values:n},t,e)=>{n[t]=Bg(e)},Vg=(n,t,e)=>{switch(n.type.precision){case mn.HALF:return vp(n,t,e);case mn.SINGLE:case mn.DOUBLE:return ku(n,t,e)}},yp=({values:n},t,e)=>{Og(n,t,e.valueOf())},bp=({values:n},t,e)=>{n[t]=BigInt(e)},kg=({stride:n,values:t},e,i)=>{t.set(i.subarray(0,n),n*e)},Sp=({values:n,valueOffsets:t},e,i)=>_p(n,t,e,i),Mp=({values:n,valueOffsets:t},e,i)=>_p(n,t,e,Nu(i)),Hg=(n,t,e)=>{n.type.unit===ti.DAY?yp(n,t,e):bp(n,t,e)},wp=({values:n},t,e)=>{n[t]=BigInt(e/1e3)},Ap=({values:n},t,e)=>{n[t]=BigInt(e)},Ep=({values:n},t,e)=>{n[t]=BigInt(e*1e3)},Tp=({values:n},t,e)=>{n[t]=BigInt(e*1e6)},Gg=(n,t,e)=>{switch(n.type.unit){case Nt.SECOND:return wp(n,t,e);case Nt.MILLISECOND:return Ap(n,t,e);case Nt.MICROSECOND:return Ep(n,t,e);case Nt.NANOSECOND:return Tp(n,t,e)}},Cp=({values:n},t,e)=>{n[t]=e},Rp=({values:n},t,e)=>{n[t]=e},Ip=({values:n},t,e)=>{n[t]=e},Dp=({values:n},t,e)=>{n[t]=e},Wg=(n,t,e)=>{switch(n.type.unit){case Nt.SECOND:return Cp(n,t,e);case Nt.MILLISECOND:return Rp(n,t,e);case Nt.MICROSECOND:return Ip(n,t,e);case Nt.NANOSECOND:return Dp(n,t,e)}},Xg=({values:n,stride:t},e,i)=>{n.set(i.subarray(0,t),t*e)},qg=(n,t,e)=>{const i=n.children[0],r=n.valueOffsets,s=ei.getVisitFn(i);if(Array.isArray(e))for(let o=-1,a=r[t],c=r[t+1];a<c;)s(i,a++,e[++o]);else for(let o=-1,a=r[t],c=r[t+1];a<c;)s(i,a++,e.get(++o))},Yg=(n,t,e)=>{const i=n.children[0],{valueOffsets:r}=n,s=ei.getVisitFn(i);let{[t]:o,[t+1]:a}=r;const c=e instanceof Map?e.entries():Object.entries(e);for(const l of c)if(s(i,o,l),++o>=a)break},$g=(n,t)=>(e,i,r,s)=>i&&e(i,n,t[s]),jg=(n,t)=>(e,i,r,s)=>i&&e(i,n,t.get(s)),Jg=(n,t)=>(e,i,r,s)=>i&&e(i,n,t.get(r.name)),Kg=(n,t)=>(e,i,r,s)=>i&&e(i,n,t[r.name]),Zg=(n,t,e)=>{const i=n.type.children.map(s=>ei.getVisitFn(s.type)),r=e instanceof Map?Jg(t,e):e instanceof Me?jg(t,e):Array.isArray(e)?$g(t,e):Kg(t,e);n.type.children.forEach((s,o)=>r(i[o],n.children[o],s,o))},Qg=(n,t,e)=>{n.type.mode===Dn.Dense?Lp(n,t,e):Pp(n,t,e)},Lp=(n,t,e)=>{const i=n.type.typeIdToChildIndex[n.typeIds[t]],r=n.children[i];ei.visit(r,n.valueOffsets[t],e)},Pp=(n,t,e)=>{const i=n.type.typeIdToChildIndex[n.typeIds[t]],r=n.children[i];ei.visit(r,t,e)},tx=(n,t,e)=>{var i;(i=n.dictionary)===null||i===void 0||i.set(n.values[t],e)},ex=(n,t,e)=>{switch(n.type.unit){case ln.YEAR_MONTH:return Fp(n,t,e);case ln.DAY_TIME:return Up(n,t,e);case ln.MONTH_DAY_NANO:return Np(n,t,e)}},Up=({values:n},t,e)=>{n.set(e.subarray(0,2),2*t)},Fp=({values:n},t,e)=>{n[t]=e[0]*12+e[1]%12},Np=({values:n,stride:t},e,i)=>{n.set(i.subarray(0,t),t*e)},Bp=({values:n},t,e)=>{n[t]=e},Op=({values:n},t,e)=>{n[t]=e},zp=({values:n},t,e)=>{n[t]=e},Vp=({values:n},t,e)=>{n[t]=e},nx=(n,t,e)=>{switch(n.type.unit){case Nt.SECOND:return Bp(n,t,e);case Nt.MILLISECOND:return Op(n,t,e);case Nt.MICROSECOND:return zp(n,t,e);case Nt.NANOSECOND:return Vp(n,t,e)}},ix=(n,t,e)=>{const{stride:i}=n,r=n.children[0],s=ei.getVisitFn(r);if(Array.isArray(e))for(let o=-1,a=t*i;++o<i;)s(r,a+o,e[o]);else for(let o=-1,a=t*i;++o<i;)s(r,a+o,e.get(o))};Lt.prototype.visitBool=Bt(zg);Lt.prototype.visitInt=Bt(nr);Lt.prototype.visitInt8=Bt(nr);Lt.prototype.visitInt16=Bt(nr);Lt.prototype.visitInt32=Bt(nr);Lt.prototype.visitInt64=Bt(nr);Lt.prototype.visitUint8=Bt(nr);Lt.prototype.visitUint16=Bt(nr);Lt.prototype.visitUint32=Bt(nr);Lt.prototype.visitUint64=Bt(nr);Lt.prototype.visitFloat=Bt(Vg);Lt.prototype.visitFloat16=Bt(vp);Lt.prototype.visitFloat32=Bt(ku);Lt.prototype.visitFloat64=Bt(ku);Lt.prototype.visitUtf8=Bt(Mp);Lt.prototype.visitLargeUtf8=Bt(Mp);Lt.prototype.visitBinary=Bt(Sp);Lt.prototype.visitLargeBinary=Bt(Sp);Lt.prototype.visitFixedSizeBinary=Bt(kg);Lt.prototype.visitDate=Bt(Hg);Lt.prototype.visitDateDay=Bt(yp);Lt.prototype.visitDateMillisecond=Bt(bp);Lt.prototype.visitTimestamp=Bt(Gg);Lt.prototype.visitTimestampSecond=Bt(wp);Lt.prototype.visitTimestampMillisecond=Bt(Ap);Lt.prototype.visitTimestampMicrosecond=Bt(Ep);Lt.prototype.visitTimestampNanosecond=Bt(Tp);Lt.prototype.visitTime=Bt(Wg);Lt.prototype.visitTimeSecond=Bt(Cp);Lt.prototype.visitTimeMillisecond=Bt(Rp);Lt.prototype.visitTimeMicrosecond=Bt(Ip);Lt.prototype.visitTimeNanosecond=Bt(Dp);Lt.prototype.visitDecimal=Bt(Xg);Lt.prototype.visitList=Bt(qg);Lt.prototype.visitStruct=Bt(Zg);Lt.prototype.visitUnion=Bt(Qg);Lt.prototype.visitDenseUnion=Bt(Lp);Lt.prototype.visitSparseUnion=Bt(Pp);Lt.prototype.visitDictionary=Bt(tx);Lt.prototype.visitInterval=Bt(ex);Lt.prototype.visitIntervalDayTime=Bt(Up);Lt.prototype.visitIntervalYearMonth=Bt(Fp);Lt.prototype.visitIntervalMonthDayNano=Bt(Np);Lt.prototype.visitDuration=Bt(nx);Lt.prototype.visitDurationSecond=Bt(Bp);Lt.prototype.visitDurationMillisecond=Bt(Op);Lt.prototype.visitDurationMicrosecond=Bt(zp);Lt.prototype.visitDurationNanosecond=Bt(Vp);Lt.prototype.visitFixedSizeList=Bt(ix);Lt.prototype.visitMap=Bt(Yg);const ei=new Lt,ai=Symbol.for("parent"),Rs=Symbol.for("rowIndex");class Hu{constructor(t,e){return this[ai]=t,this[Rs]=e,new Proxy(this,ox)}toArray(){return Object.values(this.toJSON())}toJSON(){const t=this[Rs],e=this[ai],i=e.type.children,r={};for(let s=-1,o=i.length;++s<o;)r[i[s].name]=Ln.visit(e.children[s],t);return r}toString(){return`{${[...this].map(([t,e])=>`${Do(t)}: ${Do(e)}`).join(", ")}}`}[Symbol.for("nodejs.util.inspect.custom")](){return this.toString()}[Symbol.iterator](){return new rx(this[ai],this[Rs])}}class rx{constructor(t,e){this.childIndex=0,this.children=t.children,this.rowIndex=e,this.childFields=t.type.children,this.numChildren=this.childFields.length}[Symbol.iterator](){return this}next(){const t=this.childIndex;return t<this.numChildren?(this.childIndex=t+1,{done:!1,value:[this.childFields[t].name,Ln.visit(this.children[t],this.rowIndex)]}):{done:!0,value:null}}}Object.defineProperties(Hu.prototype,{[Symbol.toStringTag]:{enumerable:!1,configurable:!1,value:"Row"},[ai]:{writable:!0,enumerable:!1,configurable:!1,value:null},[Rs]:{writable:!0,enumerable:!1,configurable:!1,value:-1}});class sx{isExtensible(){return!1}deleteProperty(){return!1}preventExtensions(){return!0}ownKeys(t){return t[ai].type.children.map(e=>e.name)}has(t,e){return t[ai].type.children.some(i=>i.name===e)}getOwnPropertyDescriptor(t,e){if(t[ai].type.children.some(i=>i.name===e))return{writable:!0,enumerable:!0,configurable:!0}}get(t,e){if(Reflect.has(t,e))return t[e];const i=t[ai].type.children.findIndex(r=>r.name===e);if(i!==-1){const r=Ln.visit(t[ai].children[i],t[Rs]);return Reflect.set(t,e,r),r}}set(t,e,i){const r=t[ai].type.children.findIndex(s=>s.name===e);return r!==-1?(ei.visit(t[ai].children[r],t[Rs],i),Reflect.set(t,e,i)):Reflect.has(t,e)||typeof e=="symbol"?Reflect.set(t,e,i):!1}}const ox=new sx;class At extends Qt{}function Pt(n){return(t,e)=>t.getValid(e)?n(t,e):null}const ax=(n,t)=>864e5*n[t],cx=(n,t)=>null,kp=(n,t,e)=>{if(e+1>=t.length)return null;const i=Be(t[e]),r=Be(t[e+1]);return n.subarray(i,r)},lx=({offset:n,values:t},e)=>{const i=n+e;return(t[i>>3]&1<<i%8)!==0},Hp=({values:n},t)=>ax(n,t),Gp=({values:n},t)=>Be(n[t]),Mr=({stride:n,values:t},e)=>t[n*e],ux=({stride:n,values:t},e)=>xp(t[n*e]),Wp=({values:n},t)=>n[t],hx=({stride:n,values:t},e)=>t.subarray(n*e,n*(e+1)),Xp=({values:n,valueOffsets:t},e)=>kp(n,t,e),qp=({values:n,valueOffsets:t},e)=>{const i=kp(n,t,e);return i!==null?Ll(i):null},dx=({values:n},t)=>n[t],fx=({type:n,values:t},e)=>n.precision!==mn.HALF?t[e]:xp(t[e]),px=(n,t)=>n.type.unit===ti.DAY?Hp(n,t):Gp(n,t),Yp=({values:n},t)=>1e3*Be(n[t]),$p=({values:n},t)=>Be(n[t]),jp=({values:n},t)=>qf(n[t],BigInt(1e3)),Jp=({values:n},t)=>qf(n[t],BigInt(1e6)),mx=(n,t)=>{switch(n.type.unit){case Nt.SECOND:return Yp(n,t);case Nt.MILLISECOND:return $p(n,t);case Nt.MICROSECOND:return jp(n,t);case Nt.NANOSECOND:return Jp(n,t)}},Kp=({values:n},t)=>n[t],Zp=({values:n},t)=>n[t],Qp=({values:n},t)=>n[t],t0=({values:n},t)=>n[t],gx=(n,t)=>{switch(n.type.unit){case Nt.SECOND:return Kp(n,t);case Nt.MILLISECOND:return Zp(n,t);case Nt.MICROSECOND:return Qp(n,t);case Nt.NANOSECOND:return t0(n,t)}},xx=({values:n,stride:t},e)=>Vu.decimal(n.subarray(t*e,t*(e+1))),_x=(n,t)=>{const{valueOffsets:e,stride:i,children:r}=n,{[t*i]:s,[t*i+1]:o}=e,c=r[0].slice(s,o-s);return new Me([c])},vx=(n,t)=>{const{valueOffsets:e,children:i}=n,{[t]:r,[t+1]:s}=e,o=i[0];return new Gu(o.slice(r,s-r))},yx=(n,t)=>new Hu(n,t),bx=(n,t)=>n.type.mode===Dn.Dense?e0(n,t):n0(n,t),e0=(n,t)=>{const e=n.type.typeIdToChildIndex[n.typeIds[t]],i=n.children[e];return Ln.visit(i,n.valueOffsets[t])},n0=(n,t)=>{const e=n.type.typeIdToChildIndex[n.typeIds[t]],i=n.children[e];return Ln.visit(i,t)},Sx=(n,t)=>{var e;return(e=n.dictionary)===null||e===void 0?void 0:e.get(n.values[t])},Mx=(n,t)=>n.type.unit===ln.MONTH_DAY_NANO?s0(n,t):n.type.unit===ln.DAY_TIME?i0(n,t):r0(n,t),i0=({values:n},t)=>n.subarray(2*t,2*(t+1)),r0=({values:n},t)=>{const e=n[t],i=new Int32Array(2);return i[0]=Math.trunc(e/12),i[1]=Math.trunc(e%12),i},s0=({values:n},t)=>n.subarray(4*t,4*(t+1)),o0=({values:n},t)=>n[t],a0=({values:n},t)=>n[t],c0=({values:n},t)=>n[t],l0=({values:n},t)=>n[t],wx=(n,t)=>{switch(n.type.unit){case Nt.SECOND:return o0(n,t);case Nt.MILLISECOND:return a0(n,t);case Nt.MICROSECOND:return c0(n,t);case Nt.NANOSECOND:return l0(n,t)}},Ax=(n,t)=>{const{stride:e,children:i}=n,s=i[0].slice(t*e,e);return new Me([s])};At.prototype.visitNull=Pt(cx);At.prototype.visitBool=Pt(lx);At.prototype.visitInt=Pt(dx);At.prototype.visitInt8=Pt(Mr);At.prototype.visitInt16=Pt(Mr);At.prototype.visitInt32=Pt(Mr);At.prototype.visitInt64=Pt(Wp);At.prototype.visitUint8=Pt(Mr);At.prototype.visitUint16=Pt(Mr);At.prototype.visitUint32=Pt(Mr);At.prototype.visitUint64=Pt(Wp);At.prototype.visitFloat=Pt(fx);At.prototype.visitFloat16=Pt(ux);At.prototype.visitFloat32=Pt(Mr);At.prototype.visitFloat64=Pt(Mr);At.prototype.visitUtf8=Pt(qp);At.prototype.visitLargeUtf8=Pt(qp);At.prototype.visitBinary=Pt(Xp);At.prototype.visitLargeBinary=Pt(Xp);At.prototype.visitFixedSizeBinary=Pt(hx);At.prototype.visitDate=Pt(px);At.prototype.visitDateDay=Pt(Hp);At.prototype.visitDateMillisecond=Pt(Gp);At.prototype.visitTimestamp=Pt(mx);At.prototype.visitTimestampSecond=Pt(Yp);At.prototype.visitTimestampMillisecond=Pt($p);At.prototype.visitTimestampMicrosecond=Pt(jp);At.prototype.visitTimestampNanosecond=Pt(Jp);At.prototype.visitTime=Pt(gx);At.prototype.visitTimeSecond=Pt(Kp);At.prototype.visitTimeMillisecond=Pt(Zp);At.prototype.visitTimeMicrosecond=Pt(Qp);At.prototype.visitTimeNanosecond=Pt(t0);At.prototype.visitDecimal=Pt(xx);At.prototype.visitList=Pt(_x);At.prototype.visitStruct=Pt(yx);At.prototype.visitUnion=Pt(bx);At.prototype.visitDenseUnion=Pt(e0);At.prototype.visitSparseUnion=Pt(n0);At.prototype.visitDictionary=Pt(Sx);At.prototype.visitInterval=Pt(Mx);At.prototype.visitIntervalDayTime=Pt(i0);At.prototype.visitIntervalYearMonth=Pt(r0);At.prototype.visitIntervalMonthDayNano=Pt(s0);At.prototype.visitDuration=Pt(wx);At.prototype.visitDurationSecond=Pt(o0);At.prototype.visitDurationMillisecond=Pt(a0);At.prototype.visitDurationMicrosecond=Pt(c0);At.prototype.visitDurationNanosecond=Pt(l0);At.prototype.visitFixedSizeList=Pt(Ax);At.prototype.visitMap=Pt(vx);const Ln=new At,ys=Symbol.for("keys"),Is=Symbol.for("vals"),bs=Symbol.for("kKeysAsStrings"),Ol=Symbol.for("_kKeysAsStrings");class Gu{constructor(t){return this[ys]=new Me([t.children[0]]).memoize(),this[Is]=t.children[1],new Proxy(this,new Tx)}get[bs](){return this[Ol]||(this[Ol]=Array.from(this[ys].toArray(),String))}[Symbol.iterator](){return new Ex(this[ys],this[Is])}get size(){return this[ys].length}toArray(){return Object.values(this.toJSON())}toJSON(){const t=this[ys],e=this[Is],i={};for(let r=-1,s=t.length;++r<s;)i[t.get(r)]=Ln.visit(e,r);return i}toString(){return`{${[...this].map(([t,e])=>`${Do(t)}: ${Do(e)}`).join(", ")}}`}[Symbol.for("nodejs.util.inspect.custom")](){return this.toString()}}class Ex{constructor(t,e){this.keys=t,this.vals=e,this.keyIndex=0,this.numKeys=t.length}[Symbol.iterator](){return this}next(){const t=this.keyIndex;return t===this.numKeys?{done:!0,value:null}:(this.keyIndex++,{done:!1,value:[this.keys.get(t),Ln.visit(this.vals,t)]})}}class Tx{isExtensible(){return!1}deleteProperty(){return!1}preventExtensions(){return!0}ownKeys(t){return t[bs]}has(t,e){return t[bs].includes(e)}getOwnPropertyDescriptor(t,e){if(t[bs].indexOf(e)!==-1)return{writable:!0,enumerable:!0,configurable:!0}}get(t,e){if(Reflect.has(t,e))return t[e];const i=t[bs].indexOf(e);if(i!==-1){const r=Ln.visit(Reflect.get(t,Is),i);return Reflect.set(t,e,r),r}}set(t,e,i){const r=t[bs].indexOf(e);return r!==-1?(ei.visit(Reflect.get(t,Is),r,i),Reflect.set(t,e,i)):Reflect.has(t,e)?Reflect.set(t,e,i):!1}}Object.defineProperties(Gu.prototype,{[Symbol.toStringTag]:{enumerable:!1,configurable:!1,value:"Row"},[ys]:{writable:!0,enumerable:!1,configurable:!1,value:null},[Is]:{writable:!0,enumerable:!1,configurable:!1,value:null},[Ol]:{writable:!0,enumerable:!1,configurable:!1,value:null}});let Kh;function u0(n,t,e,i){const{length:r=0}=n;let s=typeof t!="number"?0:t,o=typeof e!="number"?r:e;return s<0&&(s=(s%r+r)%r),o<0&&(o=(o%r+r)%r),o<s&&(Kh=s,s=o,o=Kh),o>r&&(o=r),i?i(n,s,o):[s,o]}const Wu=(n,t)=>n<0?t+n:n,Zh=n=>n!==n;function Ys(n){if(typeof n!=="object"||n===null)return Zh(n)?Zh:e=>e===n;if(n instanceof Date){const e=n.valueOf();return i=>i instanceof Date?i.valueOf()===e:!1}return ArrayBuffer.isView(n)?e=>e?wg(n,e):!1:n instanceof Map?Rx(n):Array.isArray(n)?Cx(n):n instanceof Me?Ix(n):Dx(n,!0)}function Cx(n){const t=[];for(let e=-1,i=n.length;++e<i;)t[e]=Ys(n[e]);return Ic(t)}function Rx(n){let t=-1;const e=[];for(const i of n.values())e[++t]=Ys(i);return Ic(e)}function Ix(n){const t=[];for(let e=-1,i=n.length;++e<i;)t[e]=Ys(n.get(e));return Ic(t)}function Dx(n,t=!1){const e=Object.keys(n);if(!t&&e.length===0)return()=>!1;const i=[];for(let r=-1,s=e.length;++r<s;)i[r]=Ys(n[e[r]]);return Ic(i,e)}function Ic(n,t){return e=>{if(!e||typeof e!="object")return!1;switch(e.constructor){case Array:return Lx(n,e);case Map:return Qh(n,e,e.keys());case Gu:case Hu:case Object:case void 0:return Qh(n,e,t||Object.keys(e))}return e instanceof Me?Px(n,e):!1}}function Lx(n,t){const e=n.length;if(t.length!==e)return!1;for(let i=-1;++i<e;)if(!n[i](t[i]))return!1;return!0}function Px(n,t){const e=n.length;if(t.length!==e)return!1;for(let i=-1;++i<e;)if(!n[i](t.get(i)))return!1;return!0}function Qh(n,t,e){const i=e[Symbol.iterator](),r=t instanceof Map?t.keys():Object.keys(t)[Symbol.iterator](),s=t instanceof Map?t.values():Object.values(t)[Symbol.iterator]();let o=0;const a=n.length;let c=s.next(),l=i.next(),u=r.next();for(;o<a&&!l.done&&!u.done&&!c.done&&!(l.value!==u.value||!n[o](c.value));++o,l=i.next(),u=r.next(),c=s.next());return o===a&&l.done&&u.done&&c.done?!0:(i.return&&i.return(),r.return&&r.return(),s.return&&s.return(),!1)}function h0(n,t,e,i){return(e&1<<i)!==0}function Ux(n,t,e,i){return(e&1<<i)>>i}function td(n,t,e){const i=e.byteLength+7&-8;if(n>0||e.byteLength<i){const r=new Uint8Array(i);return r.set(n%8===0?e.subarray(n>>3):zl(new Xu(e,n,t,null,h0)).subarray(0,i)),r}return e}function zl(n){const t=[];let e=0,i=0,r=0;for(const o of n)o&&(r|=1<<i),++i===8&&(t[e++]=r,r=i=0);(e===0||i>0)&&(t[e++]=r);const s=new Uint8Array(t.length+7&-8);return s.set(t),s}class Xu{constructor(t,e,i,r,s){this.bytes=t,this.length=i,this.context=r,this.get=s,this.bit=e%8,this.byteIndex=e>>3,this.byte=t[this.byteIndex++],this.index=0}next(){return this.index<this.length?(this.bit===8&&(this.bit=0,this.byte=this.bytes[this.byteIndex++]),{value:this.get(this.context,this.index++,this.byte,this.bit++)}):{done:!0,value:null}}[Symbol.iterator](){return this}}function Vl(n,t,e){if(e-t<=0)return 0;if(e-t<8){let s=0;for(const o of new Xu(n,t,e-t,n,Ux))s+=o;return s}const i=e>>3<<3,r=t+(t%8===0?0:8-t%8);return Vl(n,t,r)+Vl(n,i,e)+Fx(n,r>>3,i-r>>3)}function Fx(n,t,e){let i=0,r=Math.trunc(t);const s=new DataView(n.buffer,n.byteOffset,n.byteLength),o=e===void 0?n.byteLength:r+e;for(;o-r>=4;)i+=jc(s.getUint32(r)),r+=4;for(;o-r>=2;)i+=jc(s.getUint16(r)),r+=2;for(;o-r>=1;)i+=jc(s.getUint8(r)),r+=1;return i}function jc(n){let t=Math.trunc(n);return t=t-(t>>>1&1431655765),t=(t&858993459)+(t>>>2&858993459),(t+(t>>>4)&252645135)*16843009>>>24}const Nx=-1;class ge{get typeId(){return this.type.typeId}get ArrayType(){return this.type.ArrayType}get buffers(){return[this.valueOffsets,this.values,this.nullBitmap,this.typeIds]}get nullable(){if(this._nullCount!==0){const{type:t}=this;return yt.isSparseUnion(t)?this.children.some(e=>e.nullable):yt.isDenseUnion(t)?this.children.some(e=>e.nullable):this.nullBitmap&&this.nullBitmap.byteLength>0}return!0}get byteLength(){let t=0;const{valueOffsets:e,values:i,nullBitmap:r,typeIds:s}=this;return e&&(t+=e.byteLength),i&&(t+=i.byteLength),r&&(t+=r.byteLength),s&&(t+=s.byteLength),this.children.reduce((o,a)=>o+a.byteLength,t)}get nullCount(){if(yt.isUnion(this.type))return this.children.reduce((i,r)=>i+r.nullCount,0);let t=this._nullCount,e;return t<=Nx&&(e=this.nullBitmap)&&(this._nullCount=t=e.length===0?0:this.length-Vl(e,this.offset,this.offset+this.length)),t}constructor(t,e,i,r,s,o=[],a){this.type=t,this.children=o,this.dictionary=a,this.offset=Math.floor(Math.max(e||0,0)),this.length=Math.floor(Math.max(i||0,0)),this._nullCount=Math.floor(Math.max(r||0,-1));let c;s instanceof ge?(this.stride=s.stride,this.values=s.values,this.typeIds=s.typeIds,this.nullBitmap=s.nullBitmap,this.valueOffsets=s.valueOffsets):(this.stride=Wi(t),s&&((c=s[0])&&(this.valueOffsets=c),(c=s[1])&&(this.values=c),(c=s[2])&&(this.nullBitmap=c),(c=s[3])&&(this.typeIds=c)))}getValid(t){const{type:e}=this;if(yt.isUnion(e)){const i=e,r=this.children[i.typeIdToChildIndex[this.typeIds[t]]],s=i.mode===Dn.Dense?this.valueOffsets[t]:t;return r.getValid(s)}if(this.nullable&&this.nullCount>0){const i=this.offset+t;return(this.nullBitmap[i>>3]&1<<i%8)!==0}return!0}setValid(t,e){let i;const{type:r}=this;if(yt.isUnion(r)){const s=r,o=this.children[s.typeIdToChildIndex[this.typeIds[t]]],a=s.mode===Dn.Dense?this.valueOffsets[t]:t;i=o.getValid(a),o.setValid(a,e)}else{let{nullBitmap:s}=this;const{offset:o,length:a}=this,c=o+t,l=1<<c%8,u=c>>3;(!s||s.byteLength<=u)&&(s=new Uint8Array((o+a+63&-64)>>3).fill(255),this.nullCount>0?(s.set(td(o,a,this.nullBitmap),0),Object.assign(this,{nullBitmap:s})):Object.assign(this,{nullBitmap:s,_nullCount:0}));const h=s[u];i=(h&l)!==0,s[u]=e?h|l:h&~l}return i!==!!e&&(this._nullCount=this.nullCount+(e?-1:1)),e}clone(t=this.type,e=this.offset,i=this.length,r=this._nullCount,s=this,o=this.children){return new ge(t,e,i,r,s,o,this.dictionary)}slice(t,e){const{stride:i,typeId:r,children:s}=this,o=+(this._nullCount===0)-1,a=r===16?i:1,c=this._sliceBuffers(t,e,i,r);return this.clone(this.type,this.offset+t,e,o,c,s.length===0||this.valueOffsets?s:this._sliceChildren(s,a*t,a*e))}_changeLengthAndBackfillNullBitmap(t){if(this.typeId===P.Null)return this.clone(this.type,0,t,0);const{length:e,nullCount:i}=this,r=new Uint8Array((t+63&-64)>>3).fill(255,0,e>>3);r[e>>3]=(1<<e-(e&-8))-1,i>0&&r.set(td(this.offset,e,this.nullBitmap),0);const s=this.buffers;return s[Gi.VALIDITY]=r,this.clone(this.type,0,t,i+(t-e),s)}_sliceBuffers(t,e,i,r){let s;const{buffers:o}=this;return(s=o[Gi.TYPE])&&(o[Gi.TYPE]=s.subarray(t,t+e)),(s=o[Gi.OFFSET])&&(o[Gi.OFFSET]=s.subarray(t,t+e+1))||(s=o[Gi.DATA])&&(o[Gi.DATA]=r===6?s:s.subarray(i*t,i*(t+e))),o}_sliceChildren(t,e,i){return t.map(r=>r.slice(e,i))}}ge.prototype.children=Object.freeze([]);class So extends Qt{visit(t){return this.getVisitFn(t.type).call(this,t)}visitNull(t){const{["type"]:e,["offset"]:i=0,["length"]:r=0}=t;return new ge(e,i,r,r)}visitBool(t){const{["type"]:e,["offset"]:i=0}=t,r=ce(t.nullBitmap),s=_e(e.ArrayType,t.data),{["length"]:o=s.length>>3,["nullCount"]:a=t.nullBitmap?-1:0}=t;return new ge(e,i,o,a,[void 0,s,r])}visitInt(t){const{["type"]:e,["offset"]:i=0}=t,r=ce(t.nullBitmap),s=_e(e.ArrayType,t.data),{["length"]:o=s.length,["nullCount"]:a=t.nullBitmap?-1:0}=t;return new ge(e,i,o,a,[void 0,s,r])}visitFloat(t){const{["type"]:e,["offset"]:i=0}=t,r=ce(t.nullBitmap),s=_e(e.ArrayType,t.data),{["length"]:o=s.length,["nullCount"]:a=t.nullBitmap?-1:0}=t;return new ge(e,i,o,a,[void 0,s,r])}visitUtf8(t){const{["type"]:e,["offset"]:i=0}=t,r=ce(t.data),s=ce(t.nullBitmap),o=no(t.valueOffsets),{["length"]:a=o.length-1,["nullCount"]:c=t.nullBitmap?-1:0}=t;return new ge(e,i,a,c,[o,r,s])}visitLargeUtf8(t){const{["type"]:e,["offset"]:i=0}=t,r=ce(t.data),s=ce(t.nullBitmap),o=Vh(t.valueOffsets),{["length"]:a=o.length-1,["nullCount"]:c=t.nullBitmap?-1:0}=t;return new ge(e,i,a,c,[o,r,s])}visitBinary(t){const{["type"]:e,["offset"]:i=0}=t,r=ce(t.data),s=ce(t.nullBitmap),o=no(t.valueOffsets),{["length"]:a=o.length-1,["nullCount"]:c=t.nullBitmap?-1:0}=t;return new ge(e,i,a,c,[o,r,s])}visitLargeBinary(t){const{["type"]:e,["offset"]:i=0}=t,r=ce(t.data),s=ce(t.nullBitmap),o=Vh(t.valueOffsets),{["length"]:a=o.length-1,["nullCount"]:c=t.nullBitmap?-1:0}=t;return new ge(e,i,a,c,[o,r,s])}visitFixedSizeBinary(t){const{["type"]:e,["offset"]:i=0}=t,r=ce(t.nullBitmap),s=_e(e.ArrayType,t.data),{["length"]:o=s.length/Wi(e),["nullCount"]:a=t.nullBitmap?-1:0}=t;return new ge(e,i,o,a,[void 0,s,r])}visitDate(t){const{["type"]:e,["offset"]:i=0}=t,r=ce(t.nullBitmap),s=_e(e.ArrayType,t.data),{["length"]:o=s.length/Wi(e),["nullCount"]:a=t.nullBitmap?-1:0}=t;return new ge(e,i,o,a,[void 0,s,r])}visitTimestamp(t){const{["type"]:e,["offset"]:i=0}=t,r=ce(t.nullBitmap),s=_e(e.ArrayType,t.data),{["length"]:o=s.length/Wi(e),["nullCount"]:a=t.nullBitmap?-1:0}=t;return new ge(e,i,o,a,[void 0,s,r])}visitTime(t){const{["type"]:e,["offset"]:i=0}=t,r=ce(t.nullBitmap),s=_e(e.ArrayType,t.data),{["length"]:o=s.length/Wi(e),["nullCount"]:a=t.nullBitmap?-1:0}=t;return new ge(e,i,o,a,[void 0,s,r])}visitDecimal(t){const{["type"]:e,["offset"]:i=0}=t,r=ce(t.nullBitmap),s=_e(e.ArrayType,t.data),{["length"]:o=s.length/Wi(e),["nullCount"]:a=t.nullBitmap?-1:0}=t;return new ge(e,i,o,a,[void 0,s,r])}visitList(t){const{["type"]:e,["offset"]:i=0,["child"]:r}=t,s=ce(t.nullBitmap),o=no(t.valueOffsets),{["length"]:a=o.length-1,["nullCount"]:c=t.nullBitmap?-1:0}=t;return new ge(e,i,a,c,[o,void 0,s],[r])}visitStruct(t){const{["type"]:e,["offset"]:i=0,["children"]:r=[]}=t,s=ce(t.nullBitmap),{length:o=r.reduce((c,{length:l})=>Math.max(c,l),0),nullCount:a=t.nullBitmap?-1:0}=t;return new ge(e,i,o,a,[void 0,void 0,s],r)}visitUnion(t){const{["type"]:e,["offset"]:i=0,["children"]:r=[]}=t,s=_e(e.ArrayType,t.typeIds),{["length"]:o=s.length,["nullCount"]:a=-1}=t;if(yt.isSparseUnion(e))return new ge(e,i,o,a,[void 0,void 0,void 0,s],r);const c=no(t.valueOffsets);return new ge(e,i,o,a,[c,void 0,void 0,s],r)}visitDictionary(t){const{["type"]:e,["offset"]:i=0}=t,r=ce(t.nullBitmap),s=_e(e.indices.ArrayType,t.data),{["dictionary"]:o=new Me([new So().visit({type:e.dictionary})])}=t,{["length"]:a=s.length,["nullCount"]:c=t.nullBitmap?-1:0}=t;return new ge(e,i,a,c,[void 0,s,r],[],o)}visitInterval(t){const{["type"]:e,["offset"]:i=0}=t,r=ce(t.nullBitmap),s=_e(e.ArrayType,t.data),{["length"]:o=s.length/Wi(e),["nullCount"]:a=t.nullBitmap?-1:0}=t;return new ge(e,i,o,a,[void 0,s,r])}visitDuration(t){const{["type"]:e,["offset"]:i=0}=t,r=ce(t.nullBitmap),s=_e(e.ArrayType,t.data),{["length"]:o=s.length,["nullCount"]:a=t.nullBitmap?-1:0}=t;return new ge(e,i,o,a,[void 0,s,r])}visitFixedSizeList(t){const{["type"]:e,["offset"]:i=0,["child"]:r=new So().visit({type:e.valueType})}=t,s=ce(t.nullBitmap),{["length"]:o=r.length/Wi(e),["nullCount"]:a=t.nullBitmap?-1:0}=t;return new ge(e,i,o,a,[void 0,void 0,s],[r])}visitMap(t){const{["type"]:e,["offset"]:i=0,["child"]:r=new So().visit({type:e.childType})}=t,s=ce(t.nullBitmap),o=no(t.valueOffsets),{["length"]:a=o.length-1,["nullCount"]:c=t.nullBitmap?-1:0}=t;return new ge(e,i,a,c,[o,void 0,s],[r])}}const Bx=new So;function te(n){return Bx.visit(n)}class ed{constructor(t=0,e){this.numChunks=t,this.getChunkIterator=e,this.chunkIndex=0,this.chunkIterator=this.getChunkIterator(0)}next(){for(;this.chunkIndex<this.numChunks;){const t=this.chunkIterator.next();if(!t.done)return t;++this.chunkIndex<this.numChunks&&(this.chunkIterator=this.getChunkIterator(this.chunkIndex))}return{done:!0,value:null}}[Symbol.iterator](){return this}}function Ox(n){return n.some(t=>t.nullable)}function d0(n){return n.reduce((t,e)=>t+e.nullCount,0)}function f0(n){return n.reduce((t,e,i)=>(t[i+1]=t[i]+e.length,t),new Uint32Array(n.length+1))}function p0(n,t,e,i){const r=[];for(let s=-1,o=n.length;++s<o;){const a=n[s],c=t[s],{length:l}=a;if(c>=i)break;if(e>=c+l)continue;if(c>=e&&c+l<=i){r.push(a);continue}const u=Math.max(0,e-c),h=Math.min(i-c,l);r.push(a.slice(u,h-u))}return r.length===0&&r.push(n[0].slice(0,0)),r}function qu(n,t,e,i){let r=0,s=0,o=t.length-1;do{if(r>=o-1)return e<t[o]?i(n,r,e-t[r]):null;s=r+Math.trunc((o-r)*.5),e<t[s]?o=s:r=s}while(r<o)}function Yu(n,t){return n.getValid(t)}function hc(n){function t(e,i,r){return n(e[i],r)}return function(e){const i=this.data;return qu(i,this._offsets,e,t)}}function m0(n){let t;function e(i,r,s){return n(i[r],s,t)}return function(i,r){const s=this.data;t=r;const o=qu(s,this._offsets,i,e);return t=void 0,o}}function g0(n){let t;function e(i,r,s){let o=s,a=0,c=0;for(let l=r-1,u=i.length;++l<u;){const h=i[l];if(~(a=n(h,t,o)))return c+a;o=0,c+=h.length}return-1}return function(i,r){t=i;const s=this.data,o=typeof r!="number"?e(s,0,0):qu(s,this._offsets,r,e);return t=void 0,o}}class Et extends Qt{}function zx(n,t){return t===null&&n.length>0?0:-1}function Vx(n,t){const{nullBitmap:e}=n;if(!e||n.nullCount<=0)return-1;let i=0;for(const r of new Xu(e,n.offset+(t||0),n.length,e,h0)){if(!r)return i;++i}return-1}function Vt(n,t,e){if(t===void 0)return-1;if(t===null)switch(n.typeId){case P.Union:break;case P.Dictionary:break;default:return Vx(n,e)}const i=Ln.getVisitFn(n),r=Ys(t);for(let s=(e||0)-1,o=n.length;++s<o;)if(r(i(n,s)))return s;return-1}function x0(n,t,e){const i=Ln.getVisitFn(n),r=Ys(t);for(let s=(e||0)-1,o=n.length;++s<o;)if(r(i(n,s)))return s;return-1}Et.prototype.visitNull=zx;Et.prototype.visitBool=Vt;Et.prototype.visitInt=Vt;Et.prototype.visitInt8=Vt;Et.prototype.visitInt16=Vt;Et.prototype.visitInt32=Vt;Et.prototype.visitInt64=Vt;Et.prototype.visitUint8=Vt;Et.prototype.visitUint16=Vt;Et.prototype.visitUint32=Vt;Et.prototype.visitUint64=Vt;Et.prototype.visitFloat=Vt;Et.prototype.visitFloat16=Vt;Et.prototype.visitFloat32=Vt;Et.prototype.visitFloat64=Vt;Et.prototype.visitUtf8=Vt;Et.prototype.visitLargeUtf8=Vt;Et.prototype.visitBinary=Vt;Et.prototype.visitLargeBinary=Vt;Et.prototype.visitFixedSizeBinary=Vt;Et.prototype.visitDate=Vt;Et.prototype.visitDateDay=Vt;Et.prototype.visitDateMillisecond=Vt;Et.prototype.visitTimestamp=Vt;Et.prototype.visitTimestampSecond=Vt;Et.prototype.visitTimestampMillisecond=Vt;Et.prototype.visitTimestampMicrosecond=Vt;Et.prototype.visitTimestampNanosecond=Vt;Et.prototype.visitTime=Vt;Et.prototype.visitTimeSecond=Vt;Et.prototype.visitTimeMillisecond=Vt;Et.prototype.visitTimeMicrosecond=Vt;Et.prototype.visitTimeNanosecond=Vt;Et.prototype.visitDecimal=Vt;Et.prototype.visitList=Vt;Et.prototype.visitStruct=Vt;Et.prototype.visitUnion=Vt;Et.prototype.visitDenseUnion=x0;Et.prototype.visitSparseUnion=x0;Et.prototype.visitDictionary=Vt;Et.prototype.visitInterval=Vt;Et.prototype.visitIntervalDayTime=Vt;Et.prototype.visitIntervalYearMonth=Vt;Et.prototype.visitIntervalMonthDayNano=Vt;Et.prototype.visitDuration=Vt;Et.prototype.visitDurationSecond=Vt;Et.prototype.visitDurationMillisecond=Vt;Et.prototype.visitDurationMicrosecond=Vt;Et.prototype.visitDurationNanosecond=Vt;Et.prototype.visitFixedSizeList=Vt;Et.prototype.visitMap=Vt;const dc=new Et;class Tt extends Qt{}function Ut(n){const{type:t}=n;if(n.nullCount===0&&n.stride===1&&(yt.isInt(t)&&t.bitWidth!==64||yt.isTime(t)&&t.bitWidth!==64||yt.isFloat(t)&&t.precision!==mn.HALF))return new ed(n.data.length,i=>{const r=n.data[i];return r.values.subarray(0,r.length)[Symbol.iterator]()});let e=0;return new ed(n.data.length,i=>{const s=n.data[i].length,o=n.slice(e,e+s);return e+=s,new kx(o)})}class kx{constructor(t){this.vector=t,this.index=0}next(){return this.index<this.vector.length?{value:this.vector.get(this.index++)}:{done:!0,value:null}}[Symbol.iterator](){return this}}Tt.prototype.visitNull=Ut;Tt.prototype.visitBool=Ut;Tt.prototype.visitInt=Ut;Tt.prototype.visitInt8=Ut;Tt.prototype.visitInt16=Ut;Tt.prototype.visitInt32=Ut;Tt.prototype.visitInt64=Ut;Tt.prototype.visitUint8=Ut;Tt.prototype.visitUint16=Ut;Tt.prototype.visitUint32=Ut;Tt.prototype.visitUint64=Ut;Tt.prototype.visitFloat=Ut;Tt.prototype.visitFloat16=Ut;Tt.prototype.visitFloat32=Ut;Tt.prototype.visitFloat64=Ut;Tt.prototype.visitUtf8=Ut;Tt.prototype.visitLargeUtf8=Ut;Tt.prototype.visitBinary=Ut;Tt.prototype.visitLargeBinary=Ut;Tt.prototype.visitFixedSizeBinary=Ut;Tt.prototype.visitDate=Ut;Tt.prototype.visitDateDay=Ut;Tt.prototype.visitDateMillisecond=Ut;Tt.prototype.visitTimestamp=Ut;Tt.prototype.visitTimestampSecond=Ut;Tt.prototype.visitTimestampMillisecond=Ut;Tt.prototype.visitTimestampMicrosecond=Ut;Tt.prototype.visitTimestampNanosecond=Ut;Tt.prototype.visitTime=Ut;Tt.prototype.visitTimeSecond=Ut;Tt.prototype.visitTimeMillisecond=Ut;Tt.prototype.visitTimeMicrosecond=Ut;Tt.prototype.visitTimeNanosecond=Ut;Tt.prototype.visitDecimal=Ut;Tt.prototype.visitList=Ut;Tt.prototype.visitStruct=Ut;Tt.prototype.visitUnion=Ut;Tt.prototype.visitDenseUnion=Ut;Tt.prototype.visitSparseUnion=Ut;Tt.prototype.visitDictionary=Ut;Tt.prototype.visitInterval=Ut;Tt.prototype.visitIntervalDayTime=Ut;Tt.prototype.visitIntervalYearMonth=Ut;Tt.prototype.visitIntervalMonthDayNano=Ut;Tt.prototype.visitDuration=Ut;Tt.prototype.visitDurationSecond=Ut;Tt.prototype.visitDurationMillisecond=Ut;Tt.prototype.visitDurationMicrosecond=Ut;Tt.prototype.visitDurationNanosecond=Ut;Tt.prototype.visitFixedSizeList=Ut;Tt.prototype.visitMap=Ut;const $u=new Tt;var _0;const v0={},y0={};class Me{constructor(t){var e,i,r;const s=t[0]instanceof Me?t.flatMap(a=>a.data):t;if(s.length===0||s.some(a=>!(a instanceof ge)))throw new TypeError("Vector constructor expects an Array of Data instances.");const o=(e=s[0])===null||e===void 0?void 0:e.type;switch(s.length){case 0:this._offsets=[0];break;case 1:{const{get:a,set:c,indexOf:l}=v0[o.typeId],u=s[0];this.isValid=h=>Yu(u,h),this.get=h=>a(u,h),this.set=(h,d)=>c(u,h,d),this.indexOf=h=>l(u,h),this._offsets=[0,u.length];break}default:Object.setPrototypeOf(this,y0[o.typeId]),this._offsets=f0(s);break}this.data=s,this.type=o,this.stride=Wi(o),this.numChildren=(r=(i=o.children)===null||i===void 0?void 0:i.length)!==null&&r!==void 0?r:0,this.length=this._offsets.at(-1)}get byteLength(){return this.data.reduce((t,e)=>t+e.byteLength,0)}get nullable(){return Ox(this.data)}get nullCount(){return d0(this.data)}get ArrayType(){return this.type.ArrayType}get[Symbol.toStringTag](){return`${this.VectorName}<${this.type[Symbol.toStringTag]}>`}get VectorName(){return`${P[this.type.typeId]}Vector`}isValid(t){return!1}get(t){return null}at(t){return this.get(Wu(t,this.length))}set(t,e){}indexOf(t,e){return-1}includes(t,e){return this.indexOf(t,e)>-1}[Symbol.iterator](){return $u.visit(this)}concat(...t){return new Me(this.data.concat(t.flatMap(e=>e.data).flat(Number.POSITIVE_INFINITY)))}slice(t,e){return new Me(u0(this,t,e,({data:i,_offsets:r},s,o)=>p0(i,r,s,o)))}toJSON(){return[...this]}toArray(){const{type:t,data:e,length:i,stride:r,ArrayType:s}=this;switch(t.typeId){case P.Int:case P.Float:case P.Decimal:case P.Time:case P.Timestamp:switch(e.length){case 0:return new s;case 1:return e[0].values.subarray(0,i*r);default:return e.reduce((o,{values:a,length:c})=>(o.array.set(a.subarray(0,c*r),o.offset),o.offset+=c*r,o),{array:new s(i*r),offset:0}).array}}return[...this]}toString(){return`[${[...this].join(",")}]`}getChild(t){var e;return this.getChildAt((e=this.type.children)===null||e===void 0?void 0:e.findIndex(i=>i.name===t))}getChildAt(t){return t>-1&&t<this.numChildren?new Me(this.data.map(({children:e})=>e[t])):null}get isMemoized(){return yt.isDictionary(this.type)?this.data[0].dictionary.isMemoized:!1}memoize(){if(yt.isDictionary(this.type)){const t=new fc(this.data[0].dictionary),e=this.data.map(i=>{const r=i.clone();return r.dictionary=t,r});return new Me(e)}return new fc(this)}unmemoize(){if(yt.isDictionary(this.type)&&this.isMemoized){const t=this.data[0].dictionary.unmemoize(),e=this.data.map(i=>{const r=i.clone();return r.dictionary=t,r});return new Me(e)}return this}}_0=Symbol.toStringTag;Me[_0]=(n=>{n.type=yt.prototype,n.data=[],n.length=0,n.stride=1,n.numChildren=0,n._offsets=new Uint32Array([0]),n[Symbol.isConcatSpreadable]=!0;const t=Object.keys(P).map(e=>P[e]).filter(e=>typeof e=="number"&&e!==P.NONE);for(const e of t){const i=Ln.getVisitFnByTypeId(e),r=ei.getVisitFnByTypeId(e),s=dc.getVisitFnByTypeId(e);v0[e]={get:i,set:r,indexOf:s},y0[e]=Object.create(n,{isValid:{value:hc(Yu)},get:{value:hc(Ln.getVisitFnByTypeId(e))},set:{value:m0(ei.getVisitFnByTypeId(e))},indexOf:{value:g0(dc.getVisitFnByTypeId(e))}})}return"Vector"})(Me.prototype);class fc extends Me{constructor(t){super(t.data);const e=this.get,i=this.set,r=this.slice,s=new Array(this.length);Object.defineProperty(this,"get",{value(o){const a=s[o];if(a!==void 0)return a;const c=e.call(this,o);return s[o]=c,c}}),Object.defineProperty(this,"set",{value(o,a){i.call(this,o,a),s[o]=a}}),Object.defineProperty(this,"slice",{value:(o,a)=>new fc(r.call(this,o,a))}),Object.defineProperty(this,"isMemoized",{value:!0}),Object.defineProperty(this,"unmemoize",{value:()=>new Me(this.data)}),Object.defineProperty(this,"memoize",{value:()=>this})}}class kl{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}offset(){return this.bb.readInt64(this.bb_pos)}metaDataLength(){return this.bb.readInt32(this.bb_pos+8)}bodyLength(){return this.bb.readInt64(this.bb_pos+16)}static sizeOf(){return 24}static createBlock(t,e,i,r){return t.prep(8,24),t.writeInt64(BigInt(r??0)),t.pad(4),t.writeInt32(i),t.writeInt64(BigInt(e??0)),t.offset()}}class zn{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsFooter(t,e){return(e||new zn).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsFooter(t,e){return t.setPosition(t.position()+me),(e||new zn).__init(t.readInt32(t.position())+t.position(),t)}version(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt16(this.bb_pos+t):$e.V1}schema(t){const e=this.bb.__offset(this.bb_pos,6);return e?(t||new yi).__init(this.bb.__indirect(this.bb_pos+e),this.bb):null}dictionaries(t,e){const i=this.bb.__offset(this.bb_pos,8);return i?(e||new kl).__init(this.bb.__vector(this.bb_pos+i)+t*24,this.bb):null}dictionariesLength(){const t=this.bb.__offset(this.bb_pos,8);return t?this.bb.__vector_len(this.bb_pos+t):0}recordBatches(t,e){const i=this.bb.__offset(this.bb_pos,10);return i?(e||new kl).__init(this.bb.__vector(this.bb_pos+i)+t*24,this.bb):null}recordBatchesLength(){const t=this.bb.__offset(this.bb_pos,10);return t?this.bb.__vector_len(this.bb_pos+t):0}customMetadata(t,e){const i=this.bb.__offset(this.bb_pos,12);return i?(e||new Je).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+t*4),this.bb):null}customMetadataLength(){const t=this.bb.__offset(this.bb_pos,12);return t?this.bb.__vector_len(this.bb_pos+t):0}static startFooter(t){t.startObject(5)}static addVersion(t,e){t.addFieldInt16(0,e,$e.V1)}static addSchema(t,e){t.addFieldOffset(1,e,0)}static addDictionaries(t,e){t.addFieldOffset(2,e,0)}static startDictionariesVector(t,e){t.startVector(24,e,8)}static addRecordBatches(t,e){t.addFieldOffset(3,e,0)}static startRecordBatchesVector(t,e){t.startVector(24,e,8)}static addCustomMetadata(t,e){t.addFieldOffset(4,e,0)}static createCustomMetadataVector(t,e){t.startVector(4,e.length,4);for(let i=e.length-1;i>=0;i--)t.addOffset(e[i]);return t.endVector()}static startCustomMetadataVector(t,e){t.startVector(4,e,4)}static endFooter(t){return t.endObject()}static finishFooterBuffer(t,e){t.finish(e)}static finishSizePrefixedFooterBuffer(t,e){t.finish(e,void 0,!0)}}class pe{constructor(t=[],e,i,r=$e.V5){this.fields=t||[],this.metadata=e||new Map,i||(i=Hl(this.fields)),this.dictionaries=i,this.metadataVersion=r}get[Symbol.toStringTag](){return"Schema"}get names(){return this.fields.map(t=>t.name)}toString(){return`Schema<{ ${this.fields.map((t,e)=>`${e}: ${t}`).join(", ")} }>`}select(t){const e=new Set(t),i=this.fields.filter(r=>e.has(r.name));return new pe(i,this.metadata)}selectAt(t){const e=t.map(i=>this.fields[i]).filter(Boolean);return new pe(e,this.metadata)}assign(...t){const e=t[0]instanceof pe?t[0]:Array.isArray(t[0])?new pe(t[0]):new pe(t),i=[...this.fields],r=ia(ia(new Map,this.metadata),e.metadata),s=e.fields.filter(a=>{const c=i.findIndex(l=>l.name===a.name);return~c?(i[c]=a.clone({metadata:ia(ia(new Map,i[c].metadata),a.metadata)}))&&!1:!0}),o=Hl(s,new Map);return new pe([...i,...s],r,new Map([...this.dictionaries,...o]))}}pe.prototype.fields=null;pe.prototype.metadata=null;pe.prototype.dictionaries=null;class Ue{static new(...t){let[e,i,r,s]=t;return t[0]&&typeof t[0]=="object"&&({name:e}=t[0],i===void 0&&(i=t[0].type),r===void 0&&(r=t[0].nullable),s===void 0&&(s=t[0].metadata)),new Ue(`${e}`,i,r,s)}constructor(t,e,i=!1,r){this.name=t,this.type=e,this.nullable=i,this.metadata=r||new Map}get typeId(){return this.type.typeId}get[Symbol.toStringTag](){return"Field"}toString(){return`${this.name}: ${this.type}`}clone(...t){let[e,i,r,s]=t;return!t[0]||typeof t[0]!="object"?[e=this.name,i=this.type,r=this.nullable,s=this.metadata]=t:{name:e=this.name,type:i=this.type,nullable:r=this.nullable,metadata:s=this.metadata}=t[0],Ue.new(e,i,r,s)}}Ue.prototype.type=null;Ue.prototype.name=null;Ue.prototype.nullable=null;Ue.prototype.metadata=null;function ia(n,t){return new Map([...n||new Map,...t||new Map])}function Hl(n,t=new Map){for(let e=-1,i=n.length;++e<i;){const s=n[e].type;if(yt.isDictionary(s)){if(!t.has(s.id))t.set(s.id,s.dictionary);else if(t.get(s.id)!==s.dictionary)throw new Error("Cannot create Schema containing two different dictionaries with the same Id")}s.children&&s.children.length>0&&Hl(s.children,t)}return t}var Hx=Hf,Gx=zr;class ju{static decode(t){t=new Gx(ce(t));const e=zn.getRootAsFooter(t),i=pe.decode(e.schema(),new Map,e.version());return new Wx(i,e)}static encode(t){const e=new Hx,i=pe.encode(e,t.schema);zn.startRecordBatchesVector(e,t.numRecordBatches);for(const o of[...t.recordBatches()].slice().reverse())Ns.encode(e,o);const r=e.endVector();zn.startDictionariesVector(e,t.numDictionaries);for(const o of[...t.dictionaryBatches()].slice().reverse())Ns.encode(e,o);const s=e.endVector();return zn.startFooter(e),zn.addSchema(e,i),zn.addVersion(e,$e.V5),zn.addRecordBatches(e,r),zn.addDictionaries(e,s),zn.finishFooterBuffer(e,zn.endFooter(e)),e.asUint8Array()}get numRecordBatches(){return this._recordBatches.length}get numDictionaries(){return this._dictionaryBatches.length}constructor(t,e=$e.V5,i,r){this.schema=t,this.version=e,i&&(this._recordBatches=i),r&&(this._dictionaryBatches=r)}*recordBatches(){for(let t,e=-1,i=this.numRecordBatches;++e<i;)(t=this.getRecordBatch(e))&&(yield t)}*dictionaryBatches(){for(let t,e=-1,i=this.numDictionaries;++e<i;)(t=this.getDictionaryBatch(e))&&(yield t)}getRecordBatch(t){return t>=0&&t<this.numRecordBatches&&this._recordBatches[t]||null}getDictionaryBatch(t){return t>=0&&t<this.numDictionaries&&this._dictionaryBatches[t]||null}}class Wx extends ju{get numRecordBatches(){return this._footer.recordBatchesLength()}get numDictionaries(){return this._footer.dictionariesLength()}constructor(t,e){super(t,e.version()),this._footer=e}getRecordBatch(t){if(t>=0&&t<this.numRecordBatches){const e=this._footer.recordBatches(t);if(e)return Ns.decode(e)}return null}getDictionaryBatch(t){if(t>=0&&t<this.numDictionaries){const e=this._footer.dictionaries(t);if(e)return Ns.decode(e)}return null}}class Ns{static decode(t){return new Ns(t.metaDataLength(),t.bodyLength(),t.offset())}static encode(t,e){const{metaDataLength:i}=e,r=BigInt(e.offset),s=BigInt(e.bodyLength);return kl.createBlock(t,r,i,s)}constructor(t,e,i){this.metaDataLength=t,this.offset=Be(i),this.bodyLength=Be(e)}}let rr=class _i{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsMessage(t,e){return(e||new _i).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsMessage(t,e){return t.setPosition(t.position()+me),(e||new _i).__init(t.readInt32(t.position())+t.position(),t)}version(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt16(this.bb_pos+t):$e.V1}headerType(){const t=this.bb.__offset(this.bb_pos,6);return t?this.bb.readUint8(this.bb_pos+t):fe.NONE}header(t){const e=this.bb.__offset(this.bb_pos,8);return e?this.bb.__union(t,this.bb_pos+e):null}bodyLength(){const t=this.bb.__offset(this.bb_pos,10);return t?this.bb.readInt64(this.bb_pos+t):BigInt("0")}customMetadata(t,e){const i=this.bb.__offset(this.bb_pos,12);return i?(e||new Je).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+t*4),this.bb):null}customMetadataLength(){const t=this.bb.__offset(this.bb_pos,12);return t?this.bb.__vector_len(this.bb_pos+t):0}static startMessage(t){t.startObject(5)}static addVersion(t,e){t.addFieldInt16(0,e,$e.V1)}static addHeaderType(t,e){t.addFieldInt8(1,e,fe.NONE)}static addHeader(t,e){t.addFieldOffset(2,e,0)}static addBodyLength(t,e){t.addFieldInt64(3,e,BigInt("0"))}static addCustomMetadata(t,e){t.addFieldOffset(4,e,0)}static createCustomMetadataVector(t,e){t.startVector(4,e.length,4);for(let i=e.length-1;i>=0;i--)t.addOffset(e[i]);return t.endVector()}static startCustomMetadataVector(t,e){t.startVector(4,e,4)}static endMessage(t){return t.endObject()}static finishMessageBuffer(t,e){t.finish(e)}static finishSizePrefixedMessageBuffer(t,e){t.finish(e,void 0,!0)}static createMessage(t,e,i,r,s,o){return _i.startMessage(t),_i.addVersion(t,e),_i.addHeaderType(t,i),_i.addHeader(t,r),_i.addBodyLength(t,s),_i.addCustomMetadata(t,o),_i.endMessage(t)}};class Xx extends Qt{visit(t,e){return t==null||e==null?void 0:super.visit(t,e)}visitNull(t,e){return $h.startNull(e),$h.endNull(e)}visitInt(t,e){return kn.startInt(e),kn.addBitWidth(e,t.bitWidth),kn.addIsSigned(e,t.isSigned),kn.endInt(e)}visitFloat(t,e){return Ai.startFloatingPoint(e),Ai.addPrecision(e,t.precision),Ai.endFloatingPoint(e)}visitBinary(t,e){return Gh.startBinary(e),Gh.endBinary(e)}visitLargeBinary(t,e){return Xh.startLargeBinary(e),Xh.endLargeBinary(e)}visitBool(t,e){return Wh.startBool(e),Wh.endBool(e)}visitUtf8(t,e){return jh.startUtf8(e),jh.endUtf8(e)}visitLargeUtf8(t,e){return qh.startLargeUtf8(e),qh.endLargeUtf8(e)}visitDecimal(t,e){return ps.startDecimal(e),ps.addScale(e,t.scale),ps.addPrecision(e,t.precision),ps.addBitWidth(e,t.bitWidth),ps.endDecimal(e)}visitDate(t,e){return Da.startDate(e),Da.addUnit(e,t.unit),Da.endDate(e)}visitTime(t,e){return jn.startTime(e),jn.addUnit(e,t.unit),jn.addBitWidth(e,t.bitWidth),jn.endTime(e)}visitTimestamp(t,e){const i=t.timezone&&e.createString(t.timezone)||void 0;return Jn.startTimestamp(e),Jn.addUnit(e,t.unit),i!==void 0&&Jn.addTimezone(e,i),Jn.endTimestamp(e)}visitInterval(t,e){return Ei.startInterval(e),Ei.addUnit(e,t.unit),Ei.endInterval(e)}visitDuration(t,e){return La.startDuration(e),La.addUnit(e,t.unit),La.endDuration(e)}visitList(t,e){return Yh.startList(e),Yh.endList(e)}visitStruct(t,e){return Br.startStruct_(e),Br.endStruct_(e)}visitUnion(t,e){In.startTypeIdsVector(e,t.typeIds.length);const i=In.createTypeIdsVector(e,t.typeIds);return In.startUnion(e),In.addMode(e,t.mode),In.addTypeIds(e,i),In.endUnion(e)}visitDictionary(t,e){const i=this.visit(t.indices,e);return $i.startDictionaryEncoding(e),$i.addId(e,BigInt(t.id)),$i.addIsOrdered(e,t.isOrdered),i!==void 0&&$i.addIndexType(e,i),$i.endDictionaryEncoding(e)}visitFixedSizeBinary(t,e){return Pa.startFixedSizeBinary(e),Pa.addByteWidth(e,t.byteWidth),Pa.endFixedSizeBinary(e)}visitFixedSizeList(t,e){return Ua.startFixedSizeList(e),Ua.addListSize(e,t.listSize),Ua.endFixedSizeList(e)}visitMap(t,e){return Fa.startMap(e),Fa.addKeysSorted(e,t.keysSorted),Fa.endMap(e)}}const Jc=new Xx;function qx(n,t=new Map){return new pe($x(n,t),Ba(n.metadata),t)}function b0(n){return new Wn(n.count,S0(n.columns),M0(n.columns),null)}function Yx(n){return new Di(b0(n.data),n.id,n.isDelta)}function $x(n,t){return(n.fields||[]).filter(Boolean).map(e=>Ue.fromJSON(e,t))}function nd(n,t){return(n.children||[]).filter(Boolean).map(e=>Ue.fromJSON(e,t))}function S0(n){return(n||[]).reduce((t,e)=>[...t,new $s(e.count,jx(e.VALIDITY)),...S0(e.children)],[])}function M0(n,t=[]){for(let e=-1,i=(n||[]).length;++e<i;){const r=n[e];r.VALIDITY&&t.push(new ui(t.length,r.VALIDITY.length)),r.TYPE_ID&&t.push(new ui(t.length,r.TYPE_ID.length)),r.OFFSET&&t.push(new ui(t.length,r.OFFSET.length)),r.DATA&&t.push(new ui(t.length,r.DATA.length)),t=M0(r.children,t)}return t}function jx(n){return(n||[]).reduce((t,e)=>t+ +(e===0),0)}function Jx(n,t){let e,i,r,s,o,a;return!t||!(s=n.dictionary)?(o=rd(n,nd(n,t)),r=new Ue(n.name,o,n.nullable,Ba(n.metadata))):t.has(e=s.id)?(i=(i=s.indexType)?id(i):new Uo,a=new Fs(t.get(e),i,e,s.isOrdered),r=new Ue(n.name,a,n.nullable,Ba(n.metadata))):(i=(i=s.indexType)?id(i):new Uo,t.set(e,o=rd(n,nd(n,t))),a=new Fs(o,i,e,s.isOrdered),r=new Ue(n.name,a,n.nullable,Ba(n.metadata))),r||null}function Ba(n=[]){return new Map(n.map(({key:t,value:e})=>[t,e]))}function id(n){return new kr(n.isSigned,n.bitWidth)}function rd(n,t){const e=n.type.name;switch(e){case"NONE":return new vr;case"null":return new vr;case"binary":return new ja;case"largebinary":return new Ja;case"utf8":return new Ka;case"largeutf8":return new Za;case"bool":return new Qa;case"list":return new oc((t||[])[0]);case"struct":return new Sn(t||[]);case"struct_":return new Sn(t||[])}switch(e){case"int":{const i=n.type;return new kr(i.isSigned,i.bitWidth)}case"floatingpoint":{const i=n.type;return new $a(mn[i.precision])}case"decimal":{const i=n.type;return new tc(i.scale,i.precision,i.bitWidth)}case"date":{const i=n.type;return new ec(ti[i.unit])}case"time":{const i=n.type;return new nc(Nt[i.unit],i.bitWidth)}case"timestamp":{const i=n.type;return new ic(Nt[i.unit],i.timezone)}case"interval":{const i=n.type;return new rc(ln[i.unit])}case"duration":{const i=n.type;return new sc(Nt[i.unit])}case"union":{const i=n.type,[r,...s]=(i.mode+"").toLowerCase(),o=r.toUpperCase()+s.join("");return new ac(Dn[o],i.typeIds||[],t||[])}case"fixedsizebinary":{const i=n.type;return new cc(i.byteWidth)}case"fixedsizelist":{const i=n.type;return new lc(i.listSize,(t||[])[0])}case"map":{const i=n.type;return new uc((t||[])[0],i.keysSorted)}}throw new Error(`Unrecognized type: "${e}"`)}var Kx=Hf,Zx=zr;class ci{static fromJSON(t,e){const i=new ci(0,$e.V5,e);return i._createHeader=Qx(t,e),i}static decode(t){t=new Zx(ce(t));const e=rr.getRootAsMessage(t),i=e.bodyLength(),r=e.version(),s=e.headerType(),o=new ci(i,r,s);return o._createHeader=t_(e,s),o}static encode(t){const e=new Kx;let i=-1;return t.isSchema()?i=pe.encode(e,t.header()):t.isRecordBatch()?i=Wn.encode(e,t.header()):t.isDictionaryBatch()&&(i=Di.encode(e,t.header())),rr.startMessage(e),rr.addVersion(e,$e.V5),rr.addHeader(e,i),rr.addHeaderType(e,t.headerType),rr.addBodyLength(e,BigInt(t.bodyLength)),rr.finishMessageBuffer(e,rr.endMessage(e)),e.asUint8Array()}static from(t,e=0){if(t instanceof pe)return new ci(0,$e.V5,fe.Schema,t);if(t instanceof Wn)return new ci(e,$e.V5,fe.RecordBatch,t);if(t instanceof Di)return new ci(e,$e.V5,fe.DictionaryBatch,t);throw new Error(`Unrecognized Message header: ${t}`)}get type(){return this.headerType}get version(){return this._version}get headerType(){return this._headerType}get compression(){return this._compression}get bodyLength(){return this._bodyLength}header(){return this._createHeader()}isSchema(){return this.headerType===fe.Schema}isRecordBatch(){return this.headerType===fe.RecordBatch}isDictionaryBatch(){return this.headerType===fe.DictionaryBatch}constructor(t,e,i,r){this._version=e,this._headerType=i,this.body=new Uint8Array(0),this._compression=r?.compression,r&&(this._createHeader=()=>r),this._bodyLength=Be(t)}}let Wn=class{get nodes(){return this._nodes}get length(){return this._length}get buffers(){return this._buffers}get compression(){return this._compression}constructor(t,e,i,r){this._nodes=e,this._buffers=i,this._length=Be(t),this._compression=r}};class Di{get id(){return this._id}get data(){return this._data}get isDelta(){return this._isDelta}get length(){return this.data.length}get nodes(){return this.data.nodes}get buffers(){return this.data.buffers}constructor(t,e,i=!1){this._data=t,this._isDelta=i,this._id=Be(e)}}class ui{constructor(t,e){this.offset=Be(t),this.length=Be(e)}}class $s{constructor(t,e){this.length=Be(t),this.nullCount=Be(e)}}class Ju{constructor(t,e=Io.BUFFER){this.type=t,this.method=e}}function Qx(n,t){return(()=>{switch(t){case fe.Schema:return pe.fromJSON(n);case fe.RecordBatch:return Wn.fromJSON(n);case fe.DictionaryBatch:return Di.fromJSON(n)}throw new Error(`Unrecognized Message type: { name: ${fe[t]}, type: ${t} }`)})}function t_(n,t){return(()=>{switch(t){case fe.Schema:return pe.decode(n.header(new yi),new Map,n.version());case fe.RecordBatch:return Wn.decode(n.header(new vi),n.version());case fe.DictionaryBatch:return Di.decode(n.header(new ds),n.version())}throw new Error(`Unrecognized Message type: { name: ${fe[t]}, type: ${t} }`)})}Ue.encode=h_;Ue.decode=l_;Ue.fromJSON=Jx;pe.encode=u_;pe.decode=e_;pe.fromJSON=qx;Wn.encode=d_;Wn.decode=n_;Wn.fromJSON=b0;Di.encode=f_;Di.decode=i_;Di.fromJSON=Yx;$s.encode=p_;$s.decode=s_;ui.encode=m_;ui.decode=r_;Ju.encode=A0;Ju.decode=w0;function e_(n,t=new Map,e=$e.V5){const i=c_(n,t);return new pe(i,Oa(n),t,e)}function n_(n,t=$e.V5){return new Wn(n.length(),o_(n),a_(n,t),w0(n.compression()))}function i_(n,t=$e.V5){return new Di(Wn.decode(n.data(),t),n.id(),n.isDelta())}function r_(n){return new ui(n.offset(),n.length())}function s_(n){return new $s(n.length(),n.nullCount())}function o_(n){const t=[];for(let e,i=-1,r=-1,s=n.nodesLength();++i<s;)(e=n.nodes(i))&&(t[++r]=$s.decode(e));return t}function a_(n,t){const e=[];for(let i,r=-1,s=-1,o=n.buffersLength();++r<o;)(i=n.buffers(r))&&(t<$e.V4&&(i.bb_pos+=8*(r+1)),e[++s]=ui.decode(i));return e}function c_(n,t){const e=[];for(let i,r=-1,s=-1,o=n.fieldsLength();++r<o;)(i=n.fields(r))&&(e[++s]=Ue.decode(i,t));return e}function sd(n,t){const e=[];for(let i,r=-1,s=-1,o=n.childrenLength();++r<o;)(i=n.children(r))&&(e[++s]=Ue.decode(i,t));return e}function l_(n,t){let e,i,r,s,o,a;return!t||!(a=n.dictionary())?(r=ad(n,sd(n,t)),i=new Ue(n.name(),r,n.nullable(),Oa(n))):t.has(e=Be(a.id()))?(s=(s=a.indexType())?od(s):new Uo,o=new Fs(t.get(e),s,e,a.isOrdered()),i=new Ue(n.name(),o,n.nullable(),Oa(n))):(s=(s=a.indexType())?od(s):new Uo,t.set(e,r=ad(n,sd(n,t))),o=new Fs(r,s,e,a.isOrdered()),i=new Ue(n.name(),o,n.nullable(),Oa(n))),i||null}function Oa(n){const t=new Map;if(n)for(let e,i,r=-1,s=Math.trunc(n.customMetadataLength());++r<s;)(e=n.customMetadata(r))&&(i=e.key())!=null&&t.set(i,e.value());return t}function od(n){return new kr(n.isSigned(),n.bitWidth())}function ad(n,t){const e=n.typeType();switch(e){case Ie.NONE:return new vr;case Ie.Null:return new vr;case Ie.Binary:return new ja;case Ie.LargeBinary:return new Ja;case Ie.Utf8:return new Ka;case Ie.LargeUtf8:return new Za;case Ie.Bool:return new Qa;case Ie.List:return new oc((t||[])[0]);case Ie.Struct_:return new Sn(t||[])}switch(e){case Ie.Int:{const i=n.type(new kn);return new kr(i.isSigned(),i.bitWidth())}case Ie.FloatingPoint:{const i=n.type(new Ai);return new $a(i.precision())}case Ie.Decimal:{const i=n.type(new ps);return new tc(i.scale(),i.precision(),i.bitWidth())}case Ie.Date:{const i=n.type(new Da);return new ec(i.unit())}case Ie.Time:{const i=n.type(new jn);return new nc(i.unit(),i.bitWidth())}case Ie.Timestamp:{const i=n.type(new Jn);return new ic(i.unit(),i.timezone())}case Ie.Interval:{const i=n.type(new Ei);return new rc(i.unit())}case Ie.Duration:{const i=n.type(new La);return new sc(i.unit())}case Ie.Union:{const i=n.type(new In);return new ac(i.mode(),i.typeIdsArray()||[],t||[])}case Ie.FixedSizeBinary:{const i=n.type(new Pa);return new cc(i.byteWidth())}case Ie.FixedSizeList:{const i=n.type(new Ua);return new lc(i.listSize(),(t||[])[0])}case Ie.Map:{const i=n.type(new Fa);return new uc((t||[])[0],i.keysSorted())}}throw new Error(`Unrecognized type: "${Ie[e]}" (${e})`)}function w0(n){return n?new Ju(n.codec(),n.method()):null}function u_(n,t){const e=t.fields.map(s=>Ue.encode(n,s));yi.startFieldsVector(n,e.length);const i=yi.createFieldsVector(n,e),r=t.metadata&&t.metadata.size>0?yi.createCustomMetadataVector(n,[...t.metadata].map(([s,o])=>{const a=n.createString(`${s}`),c=n.createString(`${o}`);return Je.startKeyValue(n),Je.addKey(n,a),Je.addValue(n,c),Je.endKeyValue(n)})):-1;return yi.startSchema(n),yi.addFields(n,i),yi.addEndianness(n,g_?Us.Little:Us.Big),r!==-1&&yi.addCustomMetadata(n,r),yi.endSchema(n)}function h_(n,t){let e=-1,i=-1,r=-1;const s=t.type;let o=t.typeId;yt.isDictionary(s)?(o=s.dictionary.typeId,r=Jc.visit(s,n),i=Jc.visit(s.dictionary,n)):i=Jc.visit(s,n);const a=(s.children||[]).map(u=>Ue.encode(n,u)),c=Yn.createChildrenVector(n,a),l=t.metadata&&t.metadata.size>0?Yn.createCustomMetadataVector(n,[...t.metadata].map(([u,h])=>{const d=n.createString(`${u}`),f=n.createString(`${h}`);return Je.startKeyValue(n),Je.addKey(n,d),Je.addValue(n,f),Je.endKeyValue(n)})):-1;return t.name&&(e=n.createString(t.name)),Yn.startField(n),Yn.addType(n,i),Yn.addTypeType(n,o),Yn.addChildren(n,c),Yn.addNullable(n,!!t.nullable),e!==-1&&Yn.addName(n,e),r!==-1&&Yn.addDictionary(n,r),l!==-1&&Yn.addCustomMetadata(n,l),Yn.endField(n)}function d_(n,t){const e=t.nodes||[],i=t.buffers||[];vi.startNodesVector(n,e.length);for(const a of e.slice().reverse())$s.encode(n,a);const r=n.endVector();vi.startBuffersVector(n,i.length);for(const a of i.slice().reverse())ui.encode(n,a);const s=n.endVector();let o=null;return t.compression!==null&&(o=A0(n,t.compression)),vi.startRecordBatch(n),vi.addLength(n,BigInt(t.length)),vi.addNodes(n,r),vi.addBuffers(n,s),t.compression!==null&&o&&vi.addCompression(n,o),vi.endRecordBatch(n)}function A0(n,t){return ho.startBodyCompression(n),ho.addCodec(n,t.type),ho.addMethod(n,t.method),ho.endBodyCompression(n)}function f_(n,t){const e=Wn.encode(n,t.data);return ds.startDictionaryBatch(n),ds.addId(n,BigInt(t.id)),ds.addIsDelta(n,t.isDelta),ds.addData(n,e),ds.endDictionaryBatch(n)}function p_(n,t){return Xf.createFieldNode(n,BigInt(t.length),BigInt(t.nullCount))}function m_(n,t){return Wf.createBuffer(n,BigInt(t.offset),BigInt(t.length))}const g_=(()=>{const n=new ArrayBuffer(2);return new DataView(n).setInt16(0,256,!0),new Int16Array(n)[0]===256})(),He=Object.freeze({done:!0,value:void 0});class cd{constructor(t){this._json=t}get schema(){return this._json.schema}get batches(){return this._json.batches||[]}get dictionaries(){return this._json.dictionaries||[]}}class E0{tee(){return this._getDOMStream().tee()}pipe(t,e){return this._getNodeStream().pipe(t,e)}pipeTo(t,e){return this._getDOMStream().pipeTo(t,e)}pipeThrough(t,e){return this._getDOMStream().pipeThrough(t,e)}_getDOMStream(){return this._DOMStream||(this._DOMStream=this.toDOMStream())}_getNodeStream(){return this._nodeStream||(this._nodeStream=this.toNodeStream())}}class x_ extends E0{constructor(){super(),this._values=[],this.resolvers=[],this._closedPromise=new Promise(t=>this._closedPromiseResolve=t)}get closed(){return this._closedPromise}cancel(t){return Wt(this,void 0,void 0,function*(){yield this.return(t)})}write(t){this._ensureOpen()&&(this.resolvers.length<=0?this._values.push(t):this.resolvers.shift().resolve({done:!1,value:t}))}abort(t){this._closedPromiseResolve&&(this.resolvers.length<=0?this._error={error:t}:this.resolvers.shift().reject({done:!0,value:t}))}close(){if(this._closedPromiseResolve){const{resolvers:t}=this;for(;t.length>0;)t.shift().resolve(He);this._closedPromiseResolve(),this._closedPromiseResolve=void 0}}[Symbol.asyncIterator](){return this}toDOMStream(t){return $n.toDOMStream(this._closedPromiseResolve||this._error?this:this._values,t)}toNodeStream(t){return $n.toNodeStream(this._closedPromiseResolve||this._error?this:this._values,t)}throw(t){return Wt(this,void 0,void 0,function*(){return yield this.abort(t),He})}return(t){return Wt(this,void 0,void 0,function*(){return yield this.close(),He})}read(t){return Wt(this,void 0,void 0,function*(){return(yield this.next(t,"read")).value})}peek(t){return Wt(this,void 0,void 0,function*(){return(yield this.next(t,"peek")).value})}next(...t){return this._values.length>0?Promise.resolve({done:!1,value:this._values.shift()}):this._error?Promise.reject({done:!0,value:this._error.error}):this._closedPromiseResolve?new Promise((e,i)=>{this.resolvers.push({resolve:e,reject:i})}):Promise.resolve(He)}_ensureOpen(){if(this._closedPromiseResolve)return!0;throw new Error("AsyncQueue is closed")}}class __ extends x_{write(t){if((t=ce(t)).byteLength>0)return super.write(t)}toString(t=!1){return t?Ll(this.toUint8Array(!0)):this.toUint8Array(!1).then(Ll)}toUint8Array(t=!1){return t?Ii(this._values)[0]:Wt(this,void 0,void 0,function*(){var e,i,r,s;const o=[];let a=0;try{for(var c=!0,l=Es(this),u;u=yield l.next(),e=u.done,!e;c=!0){s=u.value,c=!1;const h=s;o.push(h),a+=h.byteLength}}catch(h){i={error:h}}finally{try{!c&&!e&&(r=l.return)&&(yield r.call(l))}finally{if(i)throw i.error}}return Ii(o,a)[0]})}}class pc{constructor(t){t&&(this.source=new v_($n.fromIterable(t)))}[Symbol.iterator](){return this}next(t){return this.source.next(t)}throw(t){return this.source.throw(t)}return(t){return this.source.return(t)}peek(t){return this.source.peek(t)}read(t){return this.source.read(t)}}class Bs{constructor(t){t instanceof Bs?this.source=t.source:t instanceof __?this.source=new Er($n.fromAsyncIterable(t)):zf(t)?this.source=new Er($n.fromNodeStream(t)):Ou(t)?this.source=new Er($n.fromDOMStream(t)):Bf(t)?this.source=new Er($n.fromDOMStream(t.body)):Rc(t)?this.source=new Er($n.fromIterable(t)):Ro(t)?this.source=new Er($n.fromAsyncIterable(t)):Bu(t)&&(this.source=new Er($n.fromAsyncIterable(t)))}[Symbol.asyncIterator](){return this}next(t){return this.source.next(t)}throw(t){return this.source.throw(t)}return(t){return this.source.return(t)}get closed(){return this.source.closed}cancel(t){return this.source.cancel(t)}peek(t){return this.source.peek(t)}read(t){return this.source.read(t)}}class v_{constructor(t){this.source=t}cancel(t){this.return(t)}peek(t){return this.next(t,"peek").value}read(t){return this.next(t,"read").value}next(t,e="read"){return this.source.next({cmd:e,size:t})}throw(t){return Object.create(this.source.throw&&this.source.throw(t)||He)}return(t){return Object.create(this.source.return&&this.source.return(t)||He)}}class Er{constructor(t){this.source=t,this._closedPromise=new Promise(e=>this._closedPromiseResolve=e)}cancel(t){return Wt(this,void 0,void 0,function*(){yield this.return(t)})}get closed(){return this._closedPromise}read(t){return Wt(this,void 0,void 0,function*(){return(yield this.next(t,"read")).value})}peek(t){return Wt(this,void 0,void 0,function*(){return(yield this.next(t,"peek")).value})}next(t){return Wt(this,arguments,void 0,function*(e,i="read"){return yield this.source.next({cmd:i,size:e})})}throw(t){return Wt(this,void 0,void 0,function*(){const e=this.source.throw&&(yield this.source.throw(t))||He;return this._closedPromiseResolve&&this._closedPromiseResolve(),this._closedPromiseResolve=void 0,Object.create(e)})}return(t){return Wt(this,void 0,void 0,function*(){const e=this.source.return&&(yield this.source.return(t))||He;return this._closedPromiseResolve&&this._closedPromiseResolve(),this._closedPromiseResolve=void 0,Object.create(e)})}}class ld extends pc{constructor(t,e){super(),this.position=0,this.buffer=ce(t),this.size=e===void 0?this.buffer.byteLength:e}readInt32(t){const{buffer:e,byteOffset:i}=this.readAt(t,4);return new DataView(e,i).getInt32(0,!0)}seek(t){return this.position=Math.min(t,this.size),t<this.size}read(t){const{buffer:e,size:i,position:r}=this;return e&&r<i?(typeof t!="number"&&(t=Number.POSITIVE_INFINITY),this.position=Math.min(i,r+Math.min(i-r,t)),e.subarray(r,this.position)):null}readAt(t,e){const i=this.buffer,r=Math.min(this.size,t+e);return i?i.subarray(t,r):new Uint8Array(e)}close(){this.buffer&&(this.buffer=null)}throw(t){return this.close(),{done:!0,value:t}}return(t){return this.close(),{done:!0,value:t}}}class mc extends Bs{constructor(t,e){super(),this.position=0,this._handle=t,typeof e=="number"?this.size=e:this._pending=Wt(this,void 0,void 0,function*(){this.size=(yield t.stat()).size,delete this._pending})}readInt32(t){return Wt(this,void 0,void 0,function*(){const{buffer:e,byteOffset:i}=yield this.readAt(t,4);return new DataView(e,i).getInt32(0,!0)})}seek(t){return Wt(this,void 0,void 0,function*(){return this._pending&&(yield this._pending),this.position=Math.min(t,this.size),t<this.size})}read(t){return Wt(this,void 0,void 0,function*(){this._pending&&(yield this._pending);const{_handle:e,size:i,position:r}=this;if(e&&r<i){typeof t!="number"&&(t=Number.POSITIVE_INFINITY);let s=r,o=0,a=0;const c=Math.min(i,s+Math.min(i-s,t)),l=new Uint8Array(Math.max(0,(this.position=c)-s));for(;(s+=a)<c&&(o+=a)<l.byteLength;)({bytesRead:a}=yield e.read(l,o,l.byteLength-o,s));return l}return null})}readAt(t,e){return Wt(this,void 0,void 0,function*(){this._pending&&(yield this._pending);const{_handle:i,size:r}=this;if(i&&t+e<r){const s=Math.min(r,t+e),o=new Uint8Array(s-t);return(yield i.read(o,0,e,t)).buffer}return new Uint8Array(e)})}close(){return Wt(this,void 0,void 0,function*(){const t=this._handle;this._handle=null,t&&(yield t.close())})}throw(t){return Wt(this,void 0,void 0,function*(){return yield this.close(),{done:!0,value:t}})}return(t){return Wt(this,void 0,void 0,function*(){return yield this.close(),{done:!0,value:t}})}}const y_=65536;function Ms(n){return n<0&&(n=4294967295+n+1),`0x${n.toString(16)}`}const Os=8,Ku=[1,10,100,1e3,1e4,1e5,1e6,1e7,1e8];class T0{constructor(t){this.buffer=t}high(){return this.buffer[1]}low(){return this.buffer[0]}_times(t){const e=new Uint32Array([this.buffer[1]>>>16,this.buffer[1]&65535,this.buffer[0]>>>16,this.buffer[0]&65535]),i=new Uint32Array([t.buffer[1]>>>16,t.buffer[1]&65535,t.buffer[0]>>>16,t.buffer[0]&65535]);let r=e[3]*i[3];this.buffer[0]=r&65535;let s=r>>>16;return r=e[2]*i[3],s+=r,r=e[3]*i[2]>>>0,s+=r,this.buffer[0]+=s<<16,this.buffer[1]=s>>>0<r?y_:0,this.buffer[1]+=s>>>16,this.buffer[1]+=e[1]*i[3]+e[2]*i[2]+e[3]*i[1],this.buffer[1]+=e[0]*i[3]+e[1]*i[2]+e[2]*i[1]+e[3]*i[0]<<16,this}_plus(t){const e=this.buffer[0]+t.buffer[0]>>>0;this.buffer[1]+=t.buffer[1],e<this.buffer[0]>>>0&&++this.buffer[1],this.buffer[0]=e}lessThan(t){return this.buffer[1]<t.buffer[1]||this.buffer[1]===t.buffer[1]&&this.buffer[0]<t.buffer[0]}equals(t){return this.buffer[1]===t.buffer[1]&&this.buffer[0]==t.buffer[0]}greaterThan(t){return t.lessThan(this)}hex(){return`${Ms(this.buffer[1])} ${Ms(this.buffer[0])}`}}class xe extends T0{times(t){return this._times(t),this}plus(t){return this._plus(t),this}static from(t,e=new Uint32Array(2)){return xe.fromString(typeof t=="string"?t:t.toString(),e)}static fromNumber(t,e=new Uint32Array(2)){return xe.fromString(t.toString(),e)}static fromString(t,e=new Uint32Array(2)){const i=t.length,r=new xe(e);for(let s=0;s<i;){const o=Os<i-s?Os:i-s,a=new xe(new Uint32Array([Number.parseInt(t.slice(s,s+o),10),0])),c=new xe(new Uint32Array([Ku[o],0]));r.times(c),r.plus(a),s+=o}return r}static convertArray(t){const e=new Uint32Array(t.length*2);for(let i=-1,r=t.length;++i<r;)xe.from(t[i],new Uint32Array(e.buffer,e.byteOffset+2*i*4,2));return e}static multiply(t,e){return new xe(new Uint32Array(t.buffer)).times(e)}static add(t,e){return new xe(new Uint32Array(t.buffer)).plus(e)}}class Cn extends T0{negate(){return this.buffer[0]=~this.buffer[0]+1,this.buffer[1]=~this.buffer[1],this.buffer[0]==0&&++this.buffer[1],this}times(t){return this._times(t),this}plus(t){return this._plus(t),this}lessThan(t){const e=this.buffer[1]<<0,i=t.buffer[1]<<0;return e<i||e===i&&this.buffer[0]<t.buffer[0]}static from(t,e=new Uint32Array(2)){return Cn.fromString(typeof t=="string"?t:t.toString(),e)}static fromNumber(t,e=new Uint32Array(2)){return Cn.fromString(t.toString(),e)}static fromString(t,e=new Uint32Array(2)){const i=t.startsWith("-"),r=t.length,s=new Cn(e);for(let o=i?1:0;o<r;){const a=Os<r-o?Os:r-o,c=new Cn(new Uint32Array([Number.parseInt(t.slice(o,o+a),10),0])),l=new Cn(new Uint32Array([Ku[a],0]));s.times(l),s.plus(c),o+=a}return i?s.negate():s}static convertArray(t){const e=new Uint32Array(t.length*2);for(let i=-1,r=t.length;++i<r;)Cn.from(t[i],new Uint32Array(e.buffer,e.byteOffset+2*i*4,2));return e}static multiply(t,e){return new Cn(new Uint32Array(t.buffer)).times(e)}static add(t,e){return new Cn(new Uint32Array(t.buffer)).plus(e)}}class bi{constructor(t){this.buffer=t}high(){return new Cn(new Uint32Array(this.buffer.buffer,this.buffer.byteOffset+8,2))}low(){return new Cn(new Uint32Array(this.buffer.buffer,this.buffer.byteOffset,2))}negate(){return this.buffer[0]=~this.buffer[0]+1,this.buffer[1]=~this.buffer[1],this.buffer[2]=~this.buffer[2],this.buffer[3]=~this.buffer[3],this.buffer[0]==0&&++this.buffer[1],this.buffer[1]==0&&++this.buffer[2],this.buffer[2]==0&&++this.buffer[3],this}times(t){const e=new xe(new Uint32Array([this.buffer[3],0])),i=new xe(new Uint32Array([this.buffer[2],0])),r=new xe(new Uint32Array([this.buffer[1],0])),s=new xe(new Uint32Array([this.buffer[0],0])),o=new xe(new Uint32Array([t.buffer[3],0])),a=new xe(new Uint32Array([t.buffer[2],0])),c=new xe(new Uint32Array([t.buffer[1],0])),l=new xe(new Uint32Array([t.buffer[0],0]));let u=xe.multiply(s,l);this.buffer[0]=u.low();const h=new xe(new Uint32Array([u.high(),0]));return u=xe.multiply(r,l),h.plus(u),u=xe.multiply(s,c),h.plus(u),this.buffer[1]=h.low(),this.buffer[3]=h.lessThan(u)?1:0,this.buffer[2]=h.high(),new xe(new Uint32Array(this.buffer.buffer,this.buffer.byteOffset+8,2)).plus(xe.multiply(i,l)).plus(xe.multiply(r,c)).plus(xe.multiply(s,a)),this.buffer[3]+=xe.multiply(e,l).plus(xe.multiply(i,c)).plus(xe.multiply(r,a)).plus(xe.multiply(s,o)).low(),this}plus(t){const e=new Uint32Array(4);return e[3]=this.buffer[3]+t.buffer[3]>>>0,e[2]=this.buffer[2]+t.buffer[2]>>>0,e[1]=this.buffer[1]+t.buffer[1]>>>0,e[0]=this.buffer[0]+t.buffer[0]>>>0,e[0]<this.buffer[0]>>>0&&++e[1],e[1]<this.buffer[1]>>>0&&++e[2],e[2]<this.buffer[2]>>>0&&++e[3],this.buffer[3]=e[3],this.buffer[2]=e[2],this.buffer[1]=e[1],this.buffer[0]=e[0],this}hex(){return`${Ms(this.buffer[3])} ${Ms(this.buffer[2])} ${Ms(this.buffer[1])} ${Ms(this.buffer[0])}`}static multiply(t,e){return new bi(new Uint32Array(t.buffer)).times(e)}static add(t,e){return new bi(new Uint32Array(t.buffer)).plus(e)}static from(t,e=new Uint32Array(4)){return bi.fromString(typeof t=="string"?t:t.toString(),e)}static fromNumber(t,e=new Uint32Array(4)){return bi.fromString(t.toString(),e)}static fromString(t,e=new Uint32Array(4)){const i=t.startsWith("-"),r=t.length,s=new bi(e);for(let o=i?1:0;o<r;){const a=Os<r-o?Os:r-o,c=new bi(new Uint32Array([Number.parseInt(t.slice(o,o+a),10),0,0,0])),l=new bi(new Uint32Array([Ku[a],0,0,0]));s.times(l),s.plus(c),o+=a}return i?s.negate():s}static convertArray(t){const e=new Uint32Array(t.length*4);for(let i=-1,r=t.length;++i<r;)bi.from(t[i],new Uint32Array(e.buffer,e.byteOffset+16*i,4));return e}}function b_(n){var t,e;const i=n.length,r=new Int32Array(i*2);for(let s=0,o=0;s<i;s++){const a=n[s];r[o++]=(t=a.days)!==null&&t!==void 0?t:0,r[o++]=(e=a.milliseconds)!==null&&e!==void 0?e:0}return r}function S_(n){var t,e;const i=n.length,r=new Int32Array(i*4);for(let s=0,o=0;s<i;s++){const a=n[s];r[o++]=(t=a.months)!==null&&t!==void 0?t:0,r[o++]=(e=a.days)!==null&&e!==void 0?e:0;const c=a.nanoseconds;c?(r[o++]=Number(BigInt(c)&BigInt(4294967295)),r[o++]=Number(BigInt(c)>>BigInt(32))):o+=2}return r}class Zu extends Qt{constructor(t,e,i,r,s=$e.V5){super(),this.nodesIndex=-1,this.buffersIndex=-1,this.bytes=t,this.nodes=e,this.buffers=i,this.dictionaries=r,this.metadataVersion=s}visit(t){return super.visit(t instanceof Ue?t.type:t)}visitNull(t,{length:e}=this.nextFieldNode()){return te({type:t,length:e})}visitBool(t,{length:e,nullCount:i}=this.nextFieldNode()){return te({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),data:this.readData(t)})}visitInt(t,{length:e,nullCount:i}=this.nextFieldNode()){return te({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),data:this.readData(t)})}visitFloat(t,{length:e,nullCount:i}=this.nextFieldNode()){return te({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),data:this.readData(t)})}visitUtf8(t,{length:e,nullCount:i}=this.nextFieldNode()){return te({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),valueOffsets:this.readOffsets(t),data:this.readData(t)})}visitLargeUtf8(t,{length:e,nullCount:i}=this.nextFieldNode()){return te({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),valueOffsets:this.readOffsets(t),data:this.readData(t)})}visitBinary(t,{length:e,nullCount:i}=this.nextFieldNode()){return te({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),valueOffsets:this.readOffsets(t),data:this.readData(t)})}visitLargeBinary(t,{length:e,nullCount:i}=this.nextFieldNode()){return te({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),valueOffsets:this.readOffsets(t),data:this.readData(t)})}visitFixedSizeBinary(t,{length:e,nullCount:i}=this.nextFieldNode()){return te({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),data:this.readData(t)})}visitDate(t,{length:e,nullCount:i}=this.nextFieldNode()){return te({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),data:this.readData(t)})}visitTimestamp(t,{length:e,nullCount:i}=this.nextFieldNode()){return te({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),data:this.readData(t)})}visitTime(t,{length:e,nullCount:i}=this.nextFieldNode()){return te({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),data:this.readData(t)})}visitDecimal(t,{length:e,nullCount:i}=this.nextFieldNode()){return te({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),data:this.readData(t)})}visitList(t,{length:e,nullCount:i}=this.nextFieldNode()){return te({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),valueOffsets:this.readOffsets(t),child:this.visit(t.children[0])})}visitStruct(t,{length:e,nullCount:i}=this.nextFieldNode()){return te({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),children:this.visitMany(t.children)})}visitUnion(t,{length:e,nullCount:i}=this.nextFieldNode()){return this.metadataVersion<$e.V5&&this.readNullBitmap(t,i),t.mode===Dn.Sparse?this.visitSparseUnion(t,{length:e,nullCount:i}):this.visitDenseUnion(t,{length:e,nullCount:i})}visitDenseUnion(t,{length:e,nullCount:i}=this.nextFieldNode()){return te({type:t,length:e,nullCount:i,typeIds:this.readTypeIds(t),valueOffsets:this.readOffsets(t),children:this.visitMany(t.children)})}visitSparseUnion(t,{length:e,nullCount:i}=this.nextFieldNode()){return te({type:t,length:e,nullCount:i,typeIds:this.readTypeIds(t),children:this.visitMany(t.children)})}visitDictionary(t,{length:e,nullCount:i}=this.nextFieldNode()){return te({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),data:this.readData(t.indices),dictionary:this.readDictionary(t)})}visitInterval(t,{length:e,nullCount:i}=this.nextFieldNode()){return te({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),data:this.readData(t)})}visitDuration(t,{length:e,nullCount:i}=this.nextFieldNode()){return te({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),data:this.readData(t)})}visitFixedSizeList(t,{length:e,nullCount:i}=this.nextFieldNode()){return te({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),child:this.visit(t.children[0])})}visitMap(t,{length:e,nullCount:i}=this.nextFieldNode()){return te({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),valueOffsets:this.readOffsets(t),child:this.visit(t.children[0])})}nextFieldNode(){return this.nodes[++this.nodesIndex]}nextBufferRange(){return this.buffers[++this.buffersIndex]}readNullBitmap(t,e,i=this.nextBufferRange()){return e>0&&this.readData(t,i)||new Uint8Array(0)}readOffsets(t,e){return this.readData(t,e)}readTypeIds(t,e){return this.readData(t,e)}readData(t,{length:e,offset:i}=this.nextBufferRange()){return this.bytes.subarray(i,i+e)}readDictionary(t){return this.dictionaries.get(t.id)}}class M_ extends Zu{constructor(t,e,i,r,s){super(new Uint8Array(0),e,i,r,s),this.sources=t}readNullBitmap(t,e,{offset:i}=this.nextBufferRange()){return e<=0?new Uint8Array(0):zl(this.sources[i])}readOffsets(t,{offset:e}=this.nextBufferRange()){return _e(Uint8Array,_e(t.OffsetArrayType,this.sources[e]))}readTypeIds(t,{offset:e}=this.nextBufferRange()){return _e(Uint8Array,_e(t.ArrayType,this.sources[e]))}readData(t,{offset:e}=this.nextBufferRange()){const{sources:i}=this;if(yt.isTimestamp(t))return _e(Uint8Array,Cn.convertArray(i[e]));if((yt.isInt(t)||yt.isTime(t))&&t.bitWidth===64||yt.isDuration(t))return _e(Uint8Array,Cn.convertArray(i[e]));if(yt.isDate(t)&&t.unit===ti.MILLISECOND)return _e(Uint8Array,Cn.convertArray(i[e]));if(yt.isDecimal(t))return _e(Uint8Array,bi.convertArray(i[e]));if(yt.isBinary(t)||yt.isLargeBinary(t)||yt.isFixedSizeBinary(t))return w_(i[e]);if(yt.isBool(t))return zl(i[e]);if(yt.isUtf8(t)||yt.isLargeUtf8(t))return Nu(i[e].join(""));if(yt.isInterval(t))switch(t.unit){case ln.DAY_TIME:return b_(i[e]);case ln.MONTH_DAY_NANO:return S_(i[e])}return _e(Uint8Array,_e(t.ArrayType,i[e].map(r=>+r)))}}function w_(n){const t=n.join(""),e=new Uint8Array(t.length/2);for(let i=0;i<t.length;i+=2)e[i>>1]=Number.parseInt(t.slice(i,i+2),16);return e}class A_ extends Zu{constructor(t,e,i,r,s){super(new Uint8Array(0),e,i,r,s),this.bodyChunks=t}readData(t,e=this.nextBufferRange()){return this.bodyChunks[this.buffersIndex]}}class Ct extends Qt{compareSchemas(t,e){return t===e||e instanceof t.constructor&&this.compareManyFields(t.fields,e.fields)}compareManyFields(t,e){return t===e||Array.isArray(t)&&Array.isArray(e)&&t.length===e.length&&t.every((i,r)=>this.compareFields(i,e[r]))}compareFields(t,e){return t===e||e instanceof t.constructor&&t.name===e.name&&t.nullable===e.nullable&&this.visit(t.type,e.type)}}function An(n,t){return t instanceof n.constructor}function qr(n,t){return n===t||An(n,t)}function ir(n,t){return n===t||An(n,t)&&n.bitWidth===t.bitWidth&&n.isSigned===t.isSigned}function Dc(n,t){return n===t||An(n,t)&&n.precision===t.precision}function E_(n,t){return n===t||An(n,t)&&n.byteWidth===t.byteWidth}function Qu(n,t){return n===t||An(n,t)&&n.unit===t.unit}function Yo(n,t){return n===t||An(n,t)&&n.unit===t.unit&&n.timezone===t.timezone}function $o(n,t){return n===t||An(n,t)&&n.unit===t.unit&&n.bitWidth===t.bitWidth}function T_(n,t){return n===t||An(n,t)&&n.children.length===t.children.length&&yr.compareManyFields(n.children,t.children)}function C_(n,t){return n===t||An(n,t)&&n.children.length===t.children.length&&yr.compareManyFields(n.children,t.children)}function th(n,t){return n===t||An(n,t)&&n.mode===t.mode&&n.typeIds.every((e,i)=>e===t.typeIds[i])&&yr.compareManyFields(n.children,t.children)}function R_(n,t){return n===t||An(n,t)&&n.id===t.id&&n.isOrdered===t.isOrdered&&yr.visit(n.indices,t.indices)&&yr.visit(n.dictionary,t.dictionary)}function Lc(n,t){return n===t||An(n,t)&&n.unit===t.unit}function jo(n,t){return n===t||An(n,t)&&n.unit===t.unit}function I_(n,t){return n===t||An(n,t)&&n.listSize===t.listSize&&n.children.length===t.children.length&&yr.compareManyFields(n.children,t.children)}function D_(n,t){return n===t||An(n,t)&&n.keysSorted===t.keysSorted&&n.children.length===t.children.length&&yr.compareManyFields(n.children,t.children)}Ct.prototype.visitNull=qr;Ct.prototype.visitBool=qr;Ct.prototype.visitInt=ir;Ct.prototype.visitInt8=ir;Ct.prototype.visitInt16=ir;Ct.prototype.visitInt32=ir;Ct.prototype.visitInt64=ir;Ct.prototype.visitUint8=ir;Ct.prototype.visitUint16=ir;Ct.prototype.visitUint32=ir;Ct.prototype.visitUint64=ir;Ct.prototype.visitFloat=Dc;Ct.prototype.visitFloat16=Dc;Ct.prototype.visitFloat32=Dc;Ct.prototype.visitFloat64=Dc;Ct.prototype.visitUtf8=qr;Ct.prototype.visitLargeUtf8=qr;Ct.prototype.visitBinary=qr;Ct.prototype.visitLargeBinary=qr;Ct.prototype.visitFixedSizeBinary=E_;Ct.prototype.visitDate=Qu;Ct.prototype.visitDateDay=Qu;Ct.prototype.visitDateMillisecond=Qu;Ct.prototype.visitTimestamp=Yo;Ct.prototype.visitTimestampSecond=Yo;Ct.prototype.visitTimestampMillisecond=Yo;Ct.prototype.visitTimestampMicrosecond=Yo;Ct.prototype.visitTimestampNanosecond=Yo;Ct.prototype.visitTime=$o;Ct.prototype.visitTimeSecond=$o;Ct.prototype.visitTimeMillisecond=$o;Ct.prototype.visitTimeMicrosecond=$o;Ct.prototype.visitTimeNanosecond=$o;Ct.prototype.visitDecimal=qr;Ct.prototype.visitList=T_;Ct.prototype.visitStruct=C_;Ct.prototype.visitUnion=th;Ct.prototype.visitDenseUnion=th;Ct.prototype.visitSparseUnion=th;Ct.prototype.visitDictionary=R_;Ct.prototype.visitInterval=Lc;Ct.prototype.visitIntervalDayTime=Lc;Ct.prototype.visitIntervalYearMonth=Lc;Ct.prototype.visitIntervalMonthDayNano=Lc;Ct.prototype.visitDuration=jo;Ct.prototype.visitDurationSecond=jo;Ct.prototype.visitDurationMillisecond=jo;Ct.prototype.visitDurationMicrosecond=jo;Ct.prototype.visitDurationNanosecond=jo;Ct.prototype.visitFixedSizeList=I_;Ct.prototype.visitMap=D_;const yr=new Ct;function L_(n,t){return yr.compareSchemas(n,t)}function Kc(n,t){return P_(n,t.map(e=>e.data.concat()))}function P_(n,t){const e=[...n.fields],i=[],r={numBatches:t.reduce((h,d)=>Math.max(h,d.length),0)};let s=0,o=0,a=-1;const c=t.length;let l,u=[];for(;r.numBatches-- >0;){for(o=Number.POSITIVE_INFINITY,a=-1;++a<c;)u[a]=l=t[a].shift(),o=Math.min(o,l?l.length:o);Number.isFinite(o)&&(u=U_(e,o,u,t,r),o>0&&(i[s++]=te({type:new Sn(e),length:o,nullCount:0,children:u.slice()})))}return[n=n.assign(e),i.map(h=>new fn(n,h))]}function U_(n,t,e,i,r){var s;const o=(t+63&-64)>>3;for(let a=-1,c=i.length;++a<c;){const l=e[a],u=l?.length;if(u>=t)u===t?e[a]=l:(e[a]=l.slice(0,t),r.numBatches=Math.max(r.numBatches,i[a].unshift(l.slice(t,u-t))));else{const h=n[a];n[a]=h.clone({nullable:!0}),e[a]=(s=l?._changeLengthAndBackfillNullBitmap(t))!==null&&s!==void 0?s:te({type:h.type,length:t,nullCount:t,nullBitmap:new Uint8Array(o)})}}return e}var C0;class Kn{constructor(...t){var e,i;if(t.length===0)return this.batches=[],this.schema=new pe([]),this._offsets=[0],this;let r,s;t[0]instanceof pe&&(r=t.shift()),t.at(-1)instanceof Uint32Array&&(s=t.pop());const o=c=>{if(c){if(c instanceof fn)return[c];if(c instanceof Kn)return c.batches;if(c instanceof ge){if(c.type instanceof Sn)return[new fn(new pe(c.type.children),c)]}else{if(Array.isArray(c))return c.flatMap(l=>o(l));if(typeof c[Symbol.iterator]=="function")return[...c].flatMap(l=>o(l));if(typeof c=="object"){const l=Object.keys(c),u=l.map(f=>new Me([c[f]])),h=r??new pe(l.map((f,g)=>new Ue(String(f),u[g].type,u[g].nullable))),[,d]=Kc(h,u);return d.length===0?[new fn(c)]:d}}}return[]},a=t.flatMap(c=>o(c));if(r=(i=r??((e=a[0])===null||e===void 0?void 0:e.schema))!==null&&i!==void 0?i:new pe([]),!(r instanceof pe))throw new TypeError("Table constructor expects a [Schema, RecordBatch[]] pair.");for(const c of a){if(!(c instanceof fn))throw new TypeError("Table constructor expects a [Schema, RecordBatch[]] pair.");if(!L_(r,c.schema))throw new TypeError("Table and inner RecordBatch schemas must be equivalent.")}this.schema=r,this.batches=a,this._offsets=s??f0(this.data)}get data(){return this.batches.map(({data:t})=>t)}get numCols(){return this.schema.fields.length}get numRows(){return this.data.reduce((t,e)=>t+e.length,0)}get nullCount(){return this._nullCount===-1&&(this._nullCount=d0(this.data)),this._nullCount}isValid(t){return!1}get(t){return null}at(t){return this.get(Wu(t,this.numRows))}set(t,e){}indexOf(t,e){return-1}[Symbol.iterator](){return this.batches.length>0?$u.visit(new Me(this.data)):new Array(0)[Symbol.iterator]()}toArray(){return[...this]}toString(){return`[
  ${this.toArray().join(`,
  `)}
]`}concat(...t){const e=this.schema,i=this.data.concat(t.flatMap(({data:r})=>r));return new Kn(e,i.map(r=>new fn(e,r)))}slice(t,e){const i=this.schema;[t,e]=u0({length:this.numRows},t,e);const r=p0(this.data,this._offsets,t,e);return new Kn(i,r.map(s=>new fn(i,s)))}getChild(t){return this.getChildAt(this.schema.fields.findIndex(e=>e.name===t))}getChildAt(t){if(t>-1&&t<this.schema.fields.length){const e=this.data.map(i=>i.children[t]);if(e.length===0){const{type:i}=this.schema.fields[t],r=te({type:i,length:0,nullCount:0});e.push(r._changeLengthAndBackfillNullBitmap(this.numRows))}return new Me(e)}return null}setChild(t,e){var i;return this.setChildAt((i=this.schema.fields)===null||i===void 0?void 0:i.findIndex(r=>r.name===t),e)}setChildAt(t,e){let i=this.schema,r=[...this.batches];if(t>-1&&t<this.numCols){e||(e=new Me([te({type:new vr,length:this.numRows})]));const s=i.fields.slice(),o=s[t].clone({type:e.type}),a=this.schema.fields.map((c,l)=>this.getChildAt(l));[s[t],a[t]]=[o,e],[i,r]=Kc(i,a)}return new Kn(i,r)}select(t){const e=this.schema.fields.reduce((i,r,s)=>i.set(r.name,s),new Map);return this.selectAt(t.map(i=>e.get(i)).filter(i=>i>-1))}selectAt(t){const e=this.schema.selectAt(t),i=this.batches.map(r=>r.selectAt(t));return new Kn(e,i)}assign(t){const e=this.schema.fields,[i,r]=t.schema.fields.reduce((a,c,l)=>{const[u,h]=a,d=e.findIndex(f=>f.name===c.name);return~d?h[d]=l:u.push(l),a},[[],[]]),s=this.schema.assign(t.schema),o=[...e.map((a,c)=>[c,r[c]]).map(([a,c])=>c===void 0?this.getChildAt(a):t.getChildAt(c)),...i.map(a=>t.getChildAt(a))].filter(Boolean);return new Kn(...Kc(s,o))}}C0=Symbol.toStringTag;Kn[C0]=(n=>(n.schema=null,n.batches=[],n._offsets=new Uint32Array([0]),n._nullCount=-1,n[Symbol.isConcatSpreadable]=!0,n.isValid=hc(Yu),n.get=hc(Ln.getVisitFn(P.Struct)),n.set=m0(ei.getVisitFn(P.Struct)),n.indexOf=g0(dc.getVisitFn(P.Struct)),"Table"))(Kn.prototype);var R0;class fn{constructor(...t){switch(t.length){case 2:{if([this.schema]=t,!(this.schema instanceof pe))throw new TypeError("RecordBatch constructor expects a [Schema, Data] pair.");if([,this.data=te({nullCount:0,type:new Sn(this.schema.fields),children:this.schema.fields.map(e=>te({type:e.type,nullCount:0}))})]=t,!(this.data instanceof ge))throw new TypeError("RecordBatch constructor expects a [Schema, Data] pair.");[this.schema,this.data]=ud(this.schema,this.data.children);break}case 1:{const[e]=t,{fields:i,children:r,length:s}=Object.keys(e).reduce((c,l,u)=>(c.children[u]=e[l],c.length=Math.max(c.length,e[l].length),c.fields[u]=Ue.new({name:l,type:e[l].type,nullable:!0}),c),{length:0,fields:new Array,children:new Array}),o=new pe(i),a=te({type:new Sn(i),length:s,children:r,nullCount:0});[this.schema,this.data]=ud(o,a.children,s);break}default:throw new TypeError("RecordBatch constructor expects an Object mapping names to child Data, or a [Schema, Data] pair.")}}get dictionaries(){return this._dictionaries||(this._dictionaries=I0(this.schema.fields,this.data.children))}get numCols(){return this.schema.fields.length}get numRows(){return this.data.length}get nullCount(){return this.data.nullCount}isValid(t){return this.data.getValid(t)}get(t){return Ln.visit(this.data,t)}at(t){return this.get(Wu(t,this.numRows))}set(t,e){return ei.visit(this.data,t,e)}indexOf(t,e){return dc.visit(this.data,t,e)}[Symbol.iterator](){return $u.visit(new Me([this.data]))}toArray(){return[...this]}concat(...t){return new Kn(this.schema,[this,...t])}slice(t,e){const[i]=new Me([this.data]).slice(t,e).data;return new fn(this.schema,i)}getChild(t){var e;return this.getChildAt((e=this.schema.fields)===null||e===void 0?void 0:e.findIndex(i=>i.name===t))}getChildAt(t){return t>-1&&t<this.schema.fields.length?new Me([this.data.children[t]]):null}setChild(t,e){var i;return this.setChildAt((i=this.schema.fields)===null||i===void 0?void 0:i.findIndex(r=>r.name===t),e)}setChildAt(t,e){let i=this.schema,r=this.data;if(t>-1&&t<this.numCols){e||(e=new Me([te({type:new vr,length:this.numRows})]));const s=i.fields.slice(),o=r.children.slice(),a=s[t].clone({type:e.type});[s[t],o[t]]=[a,e.data[0]],i=new pe(s,new Map(this.schema.metadata)),r=te({type:new Sn(s),children:o})}return new fn(i,r)}select(t){const e=this.schema.select(t),i=new Sn(e.fields),r=[];for(const s of t){const o=this.schema.fields.findIndex(a=>a.name===s);~o&&(r[o]=this.data.children[o])}return new fn(e,te({type:i,length:this.numRows,children:r}))}selectAt(t){const e=this.schema.selectAt(t),i=t.map(s=>this.data.children[s]).filter(Boolean),r=te({type:new Sn(e.fields),length:this.numRows,children:i});return new fn(e,r)}}R0=Symbol.toStringTag;fn[R0]=(n=>(n._nullCount=-1,n[Symbol.isConcatSpreadable]=!0,"RecordBatch"))(fn.prototype);function ud(n,t,e=t.reduce((i,r)=>Math.max(i,r.length),0)){var i;const r=[...n.fields],s=[...t],o=(e+63&-64)>>3;for(const[a,c]of n.fields.entries()){const l=t[a];(!l||l.length!==e)&&(r[a]=c.clone({nullable:!0}),s[a]=(i=l?._changeLengthAndBackfillNullBitmap(e))!==null&&i!==void 0?i:te({type:c.type,length:e,nullCount:e,nullBitmap:new Uint8Array(o)}))}return[n.assign(r),te({type:new Sn(r),length:e,children:s})]}function I0(n,t,e=new Map){var i,r;if(((i=n?.length)!==null&&i!==void 0?i:0)>0&&n?.length===t?.length)for(let s=-1,o=n.length;++s<o;){const{type:a}=n[s],c=t[s];for(const l of[c,...((r=c?.dictionary)===null||r===void 0?void 0:r.data)||[]])I0(a.children,l?.children,e);if(yt.isDictionary(a)){const{id:l}=a;if(!e.has(l))c?.dictionary&&e.set(l,c.dictionary);else if(e.get(l)!==c.dictionary)throw new Error("Cannot create Schema containing two different dictionaries with the same Id")}}return e}class D0 extends fn{constructor(t){const e=t.fields.map(r=>te({type:r.type})),i=te({type:new Sn(t.fields),nullCount:0,children:e});super(t,i)}}const eh=n=>`Expected ${fe[n]} Message in stream, but was null or length 0.`,nh=n=>`Header pointer of flatbuffer-encoded ${fe[n]} Message is null or length 0.`,L0=(n,t)=>`Expected to read ${n} metadata bytes, but only read ${t}.`,P0=(n,t)=>`Expected to read ${n} bytes for message body, but only read ${t}.`;class U0{constructor(t){this.source=t instanceof pc?t:new pc(t)}[Symbol.iterator](){return this}next(){let t;return(t=this.readMetadataLength()).done||t.value===-1&&(t=this.readMetadataLength()).done||(t=this.readMetadata(t.value)).done?He:t}throw(t){return this.source.throw(t)}return(t){return this.source.return(t)}readMessage(t){let e;if((e=this.next()).done)return null;if(t!=null&&e.value.headerType!==t)throw new Error(eh(t));return e.value}readMessageBody(t){if(t<=0)return new Uint8Array(0);const e=ce(this.source.read(t));if(e.byteLength<t)throw new Error(P0(t,e.byteLength));return e.byteOffset%8===0&&e.byteOffset+e.byteLength<=e.buffer.byteLength?e:e.slice()}readSchema(t=!1){const e=fe.Schema,i=this.readMessage(e),r=i?.header();if(t&&!r)throw new Error(nh(e));return r}readMetadataLength(){const t=this.source.read(Pc),e=t&&new zr(t),i=e?.readInt32(0)||0;return{done:i===0,value:i}}readMetadata(t){const e=this.source.read(t);if(!e)return He;if(e.byteLength<t)throw new Error(L0(t,e.byteLength));return{done:!1,value:ci.decode(e)}}}class F_{constructor(t,e){this.source=t instanceof Bs?t:Nf(t)?new mc(t,e):new Bs(t)}[Symbol.asyncIterator](){return this}next(){return Wt(this,void 0,void 0,function*(){let t;return(t=yield this.readMetadataLength()).done||t.value===-1&&(t=yield this.readMetadataLength()).done||(t=yield this.readMetadata(t.value)).done?He:t})}throw(t){return Wt(this,void 0,void 0,function*(){return yield this.source.throw(t)})}return(t){return Wt(this,void 0,void 0,function*(){return yield this.source.return(t)})}readMessage(t){return Wt(this,void 0,void 0,function*(){let e;if((e=yield this.next()).done)return null;if(t!=null&&e.value.headerType!==t)throw new Error(eh(t));return e.value})}readMessageBody(t){return Wt(this,void 0,void 0,function*(){if(t<=0)return new Uint8Array(0);const e=ce(yield this.source.read(t));if(e.byteLength<t)throw new Error(P0(t,e.byteLength));return e.byteOffset%8===0&&e.byteOffset+e.byteLength<=e.buffer.byteLength?e:e.slice()})}readSchema(){return Wt(this,arguments,void 0,function*(t=!1){const e=fe.Schema,i=yield this.readMessage(e),r=i?.header();if(t&&!r)throw new Error(nh(e));return r})}readMetadataLength(){return Wt(this,void 0,void 0,function*(){const t=yield this.source.read(Pc),e=t&&new zr(t),i=e?.readInt32(0)||0;return{done:i===0,value:i}})}readMetadata(t){return Wt(this,void 0,void 0,function*(){const e=yield this.source.read(t);if(!e)return He;if(e.byteLength<t)throw new Error(L0(t,e.byteLength));return{done:!1,value:ci.decode(e)}})}}class N_ extends U0{constructor(t){super(new Uint8Array(0)),this._schema=!1,this._body=[],this._batchIndex=0,this._dictionaryIndex=0,this._json=t instanceof cd?t:new cd(t)}next(){const{_json:t}=this;if(!this._schema)return this._schema=!0,{done:!1,value:ci.fromJSON(t.schema,fe.Schema)};if(this._dictionaryIndex<t.dictionaries.length){const e=t.dictionaries[this._dictionaryIndex++];return this._body=e.data.columns,{done:!1,value:ci.fromJSON(e,fe.DictionaryBatch)}}if(this._batchIndex<t.batches.length){const e=t.batches[this._batchIndex++];return this._body=e.columns,{done:!1,value:ci.fromJSON(e,fe.RecordBatch)}}return this._body=[],He}readMessageBody(t){return e(this._body);function e(i){return(i||[]).reduce((r,s)=>[...r,...s.VALIDITY&&[s.VALIDITY]||[],...s.TYPE_ID&&[s.TYPE_ID]||[],...s.OFFSET&&[s.OFFSET]||[],...s.DATA&&[s.DATA]||[],...e(s.children)],[])}}readMessage(t){let e;if((e=this.next()).done)return null;if(t!=null&&e.value.headerType!==t)throw new Error(eh(t));return e.value}readSchema(){const t=fe.Schema,e=this.readMessage(t),i=e?.header();if(!e||!i)throw new Error(nh(t));return i}}const Pc=4,Gl="ARROW1",gc=new Uint8Array(Gl.length);for(let n=0;n<Gl.length;n+=1)gc[n]=Gl.codePointAt(n);function ih(n,t=0){for(let e=-1,i=gc.length;++e<i;)if(gc[e]!==n[t+e])return!1;return!0}const Jo=gc.length,F0=Jo+Pc,B_=Jo*2+Pc;class O_{constructor(){this.LZ4_FRAME_MAGIC=new Uint8Array([4,34,77,24]),this.MIN_HEADER_LENGTH=7}isValidCodecEncode(t){const e=new Uint8Array([1,2,3,4,5,6,7,8]),i=t.encode(e);return this._isValidCompressed(i)}_isValidCompressed(t){return this._hasMinimumLength(t)&&this._hasValidMagicNumber(t)&&this._hasValidVersion(t)}_hasMinimumLength(t){return t.length>=this.MIN_HEADER_LENGTH}_hasValidMagicNumber(t){return this.LZ4_FRAME_MAGIC.every((e,i)=>t[i]===e)}_hasValidVersion(t){return(t[4]&192)>>6===1}}class z_{constructor(){this.ZSTD_MAGIC=new Uint8Array([40,181,47,253]),this.MIN_HEADER_LENGTH=6}isValidCodecEncode(t){const e=new Uint8Array([1,2,3,4,5,6,7,8]),i=t.encode(e);return this._isValidCompressed(i)}_isValidCompressed(t){return this._hasMinimumLength(t)&&this._hasValidMagicNumber(t)}_hasMinimumLength(t){return t.length>=this.MIN_HEADER_LENGTH}_hasValidMagicNumber(t){return this.ZSTD_MAGIC.every((e,i)=>t[i]===e)}}const V_={[Vr.LZ4_FRAME]:new O_,[Vr.ZSTD]:new z_};class k_{constructor(){this.registry={}}set(t,e){if(e?.encode&&typeof e.encode=="function"&&!V_[t].isValidCodecEncode(e))throw new Error(`Encoder for ${Vr[t]} is not valid.`);this.registry[t]=e}get(t){var e;return((e=this.registry)===null||e===void 0?void 0:e[t])||null}}const hd=new k_,H_=-1,G_=8;class Ki extends E0{constructor(t){super(),this._impl=t}get closed(){return this._impl.closed}get schema(){return this._impl.schema}get autoDestroy(){return this._impl.autoDestroy}get dictionaries(){return this._impl.dictionaries}get numDictionaries(){return this._impl.numDictionaries}get numRecordBatches(){return this._impl.numRecordBatches}get footer(){return this._impl.isFile()?this._impl.footer:null}isSync(){return this._impl.isSync()}isAsync(){return this._impl.isAsync()}isFile(){return this._impl.isFile()}isStream(){return this._impl.isStream()}next(){return this._impl.next()}throw(t){return this._impl.throw(t)}return(t){return this._impl.return(t)}cancel(){return this._impl.cancel()}reset(t){return this._impl.reset(t),this._DOMStream=void 0,this._nodeStream=void 0,this}open(t){const e=this._impl.open(t);return Ro(e)?e.then(()=>this):this}readRecordBatch(t){return this._impl.isFile()?this._impl.readRecordBatch(t):null}[Symbol.iterator](){return this._impl[Symbol.iterator]()}[Symbol.asyncIterator](){return this._impl[Symbol.asyncIterator]()}toDOMStream(){return $n.toDOMStream(this.isSync()?{[Symbol.iterator]:()=>this}:{[Symbol.asyncIterator]:()=>this})}toNodeStream(){return $n.toNodeStream(this.isSync()?{[Symbol.iterator]:()=>this}:{[Symbol.asyncIterator]:()=>this},{objectMode:!0})}static throughNode(t){throw new Error('"throughNode" not available in this environment')}static throughDOM(t,e){throw new Error('"throughDOM" not available in this environment')}static from(t){return t instanceof Ki?t:Pl(t)?Y_(t):Nf(t)?J_(t):Ro(t)?Wt(this,void 0,void 0,function*(){return yield Ki.from(yield t)}):Bf(t)||Ou(t)||zf(t)||Bu(t)?j_(new Bs(t)):$_(new pc(t))}static readAll(t){return t instanceof Ki?t.isSync()?dd(t):fd(t):Pl(t)||ArrayBuffer.isView(t)||Rc(t)||Ff(t)?dd(t):fd(t)}}class xc extends Ki{constructor(t){super(t),this._impl=t}readAll(){return[...this]}[Symbol.iterator](){return this._impl[Symbol.iterator]()}[Symbol.asyncIterator](){return Ti(this,arguments,function*(){yield Jt(yield*Ia(Es(this[Symbol.iterator]())))})}}class _c extends Ki{constructor(t){super(t),this._impl=t}readAll(){return Wt(this,void 0,void 0,function*(){var t,e,i,r;const s=new Array;try{for(var o=!0,a=Es(this),c;c=yield a.next(),t=c.done,!t;o=!0){r=c.value,o=!1;const l=r;s.push(l)}}catch(l){e={error:l}}finally{try{!o&&!t&&(i=a.return)&&(yield i.call(a))}finally{if(e)throw e.error}}return s})}[Symbol.iterator](){throw new Error("AsyncRecordBatchStreamReader is not Iterable")}[Symbol.asyncIterator](){return this._impl[Symbol.asyncIterator]()}}class N0 extends xc{constructor(t){super(t),this._impl=t}}class W_ extends _c{constructor(t){super(t),this._impl=t}}class B0{get numDictionaries(){return this._dictionaryIndex}get numRecordBatches(){return this._recordBatchIndex}constructor(t=new Map){this.closed=!1,this.autoDestroy=!0,this._dictionaryIndex=0,this._recordBatchIndex=0,this.dictionaries=t}isSync(){return!1}isAsync(){return!1}isFile(){return!1}isStream(){return!1}reset(t){return this._dictionaryIndex=0,this._recordBatchIndex=0,this.schema=t,this.dictionaries=new Map,this}_loadRecordBatch(t,e){let i;if(t.compression!=null){const s=hd.get(t.compression.type);if(s?.decode&&typeof s.decode=="function"){const{decommpressedBody:o,buffers:a}=this._decompressBuffers(t,e,s);i=this._loadCompressedVectors(t,o,this.schema.fields),t=new Wn(t.length,t.nodes,a,null)}else throw new Error("Record batch is compressed but codec not found")}else i=this._loadVectors(t,e,this.schema.fields);const r=te({type:new Sn(this.schema.fields),length:t.length,children:i});return new fn(this.schema,r)}_loadDictionaryBatch(t,e){const{id:i,isDelta:r}=t,{dictionaries:s,schema:o}=this,a=s.get(i),c=o.dictionaries.get(i);let l;if(t.data.compression!=null){const u=hd.get(t.data.compression.type);if(u?.decode&&typeof u.decode=="function"){const{decommpressedBody:h,buffers:d}=this._decompressBuffers(t.data,e,u);l=this._loadCompressedVectors(t.data,h,[c]),t=new Di(new Wn(t.data.length,t.data.nodes,d,null),i,r)}else throw new Error("Dictionary batch is compressed but codec not found")}else l=this._loadVectors(t.data,e,[c]);return(a&&r?a.concat(new Me(l)):new Me(l)).memoize()}_loadVectors(t,e,i){return new Zu(e,t.nodes,t.buffers,this.dictionaries,this.schema.metadataVersion).visitMany(i)}_loadCompressedVectors(t,e,i){return new A_(e,t.nodes,t.buffers,this.dictionaries,this.schema.metadataVersion).visitMany(i)}_decompressBuffers(t,e,i){const r=[],s=[];let o=0;for(const{offset:a,length:c}of t.buffers){if(c===0){r.push(new Uint8Array(0)),s.push(new ui(o,0));continue}const l=new zr(e.subarray(a,a+c)),u=Be(l.readInt64(0)),h=l.bytes().subarray(G_),d=u===H_?h:i.decode(h);r.push(d);const f=(o+7&-8)-o;o+=f,s.push(new ui(o,d.length)),o+=d.length}return{decommpressedBody:r,buffers:s}}}class vc extends B0{constructor(t,e){super(e),this._reader=Pl(t)?new N_(this._handle=t):new U0(this._handle=t)}isSync(){return!0}isStream(){return!0}[Symbol.iterator](){return this}cancel(){!this.closed&&(this.closed=!0)&&(this.reset()._reader.return(),this._reader=null,this.dictionaries=null)}open(t){return this.closed||(this.autoDestroy=z0(this,t),this.schema||(this.schema=this._reader.readSchema())||this.cancel()),this}throw(t){return!this.closed&&this.autoDestroy&&(this.closed=!0)?this.reset()._reader.throw(t):He}return(t){return!this.closed&&this.autoDestroy&&(this.closed=!0)?this.reset()._reader.return(t):He}next(){if(this.closed)return He;let t;const{_reader:e}=this;for(;t=this._readNextMessageAndValidate();)if(t.isSchema())this.reset(t.header());else if(t.isRecordBatch()){this._recordBatchIndex++;const i=t.header(),r=e.readMessageBody(t.bodyLength);return{done:!1,value:this._loadRecordBatch(i,r)}}else if(t.isDictionaryBatch()){this._dictionaryIndex++;const i=t.header(),r=e.readMessageBody(t.bodyLength),s=this._loadDictionaryBatch(i,r);this.dictionaries.set(i.id,s)}return this.schema&&this._recordBatchIndex===0?(this._recordBatchIndex++,{done:!1,value:new D0(this.schema)}):this.return()}_readNextMessageAndValidate(t){return this._reader.readMessage(t)}}class yc extends B0{constructor(t,e){super(e),this._reader=new F_(this._handle=t)}isAsync(){return!0}isStream(){return!0}[Symbol.asyncIterator](){return this}cancel(){return Wt(this,void 0,void 0,function*(){!this.closed&&(this.closed=!0)&&(yield this.reset()._reader.return(),this._reader=null,this.dictionaries=null)})}open(t){return Wt(this,void 0,void 0,function*(){return this.closed||(this.autoDestroy=z0(this,t),this.schema||(this.schema=yield this._reader.readSchema())||(yield this.cancel())),this})}throw(t){return Wt(this,void 0,void 0,function*(){return!this.closed&&this.autoDestroy&&(this.closed=!0)?yield this.reset()._reader.throw(t):He})}return(t){return Wt(this,void 0,void 0,function*(){return!this.closed&&this.autoDestroy&&(this.closed=!0)?yield this.reset()._reader.return(t):He})}next(){return Wt(this,void 0,void 0,function*(){if(this.closed)return He;let t;const{_reader:e}=this;for(;t=yield this._readNextMessageAndValidate();)if(t.isSchema())yield this.reset(t.header());else if(t.isRecordBatch()){this._recordBatchIndex++;const i=t.header(),r=yield e.readMessageBody(t.bodyLength);return{done:!1,value:this._loadRecordBatch(i,r)}}else if(t.isDictionaryBatch()){this._dictionaryIndex++;const i=t.header(),r=yield e.readMessageBody(t.bodyLength),s=this._loadDictionaryBatch(i,r);this.dictionaries.set(i.id,s)}return this.schema&&this._recordBatchIndex===0?(this._recordBatchIndex++,{done:!1,value:new D0(this.schema)}):yield this.return()})}_readNextMessageAndValidate(t){return Wt(this,void 0,void 0,function*(){return yield this._reader.readMessage(t)})}}class O0 extends vc{get footer(){return this._footer}get numDictionaries(){return this._footer?this._footer.numDictionaries:0}get numRecordBatches(){return this._footer?this._footer.numRecordBatches:0}constructor(t,e){super(t instanceof ld?t:new ld(t),e)}isSync(){return!0}isFile(){return!0}open(t){if(!this.closed&&!this._footer){this.schema=(this._footer=this._readFooter()).schema;for(const e of this._footer.dictionaryBatches())e&&this._readDictionaryBatch(this._dictionaryIndex++)}return super.open(t)}readRecordBatch(t){var e;if(this.closed)return null;this._footer||this.open();const i=(e=this._footer)===null||e===void 0?void 0:e.getRecordBatch(t);if(i&&this._handle.seek(i.offset)){const r=this._reader.readMessage(fe.RecordBatch);if(r?.isRecordBatch()){const s=r.header(),o=this._reader.readMessageBody(r.bodyLength);return this._loadRecordBatch(s,o)}}return null}_readDictionaryBatch(t){var e;const i=(e=this._footer)===null||e===void 0?void 0:e.getDictionaryBatch(t);if(i&&this._handle.seek(i.offset)){const r=this._reader.readMessage(fe.DictionaryBatch);if(r?.isDictionaryBatch()){const s=r.header(),o=this._reader.readMessageBody(r.bodyLength),a=this._loadDictionaryBatch(s,o);this.dictionaries.set(s.id,a)}}}_readFooter(){const{_handle:t}=this,e=t.size-F0,i=t.readInt32(e),r=t.readAt(e-i,i);return ju.decode(r)}_readNextMessageAndValidate(t){var e;if(this._footer||this.open(),this._footer&&this._recordBatchIndex<this.numRecordBatches){const i=(e=this._footer)===null||e===void 0?void 0:e.getRecordBatch(this._recordBatchIndex);if(i&&this._handle.seek(i.offset))return this._reader.readMessage(t)}return null}}class X_ extends yc{get footer(){return this._footer}get numDictionaries(){return this._footer?this._footer.numDictionaries:0}get numRecordBatches(){return this._footer?this._footer.numRecordBatches:0}constructor(t,...e){const i=typeof e[0]!="number"?e.shift():void 0,r=e[0]instanceof Map?e.shift():void 0;super(t instanceof mc?t:new mc(t,i),r)}isFile(){return!0}isAsync(){return!0}open(t){const e=Object.create(null,{open:{get:()=>super.open}});return Wt(this,void 0,void 0,function*(){if(!this.closed&&!this._footer){this.schema=(this._footer=yield this._readFooter()).schema;for(const i of this._footer.dictionaryBatches())i&&(yield this._readDictionaryBatch(this._dictionaryIndex++))}return yield e.open.call(this,t)})}readRecordBatch(t){return Wt(this,void 0,void 0,function*(){var e;if(this.closed)return null;this._footer||(yield this.open());const i=(e=this._footer)===null||e===void 0?void 0:e.getRecordBatch(t);if(i&&(yield this._handle.seek(i.offset))){const r=yield this._reader.readMessage(fe.RecordBatch);if(r?.isRecordBatch()){const s=r.header(),o=yield this._reader.readMessageBody(r.bodyLength);return this._loadRecordBatch(s,o)}}return null})}_readDictionaryBatch(t){return Wt(this,void 0,void 0,function*(){var e;const i=(e=this._footer)===null||e===void 0?void 0:e.getDictionaryBatch(t);if(i&&(yield this._handle.seek(i.offset))){const r=yield this._reader.readMessage(fe.DictionaryBatch);if(r?.isDictionaryBatch()){const s=r.header(),o=yield this._reader.readMessageBody(r.bodyLength),a=this._loadDictionaryBatch(s,o);this.dictionaries.set(s.id,a)}}})}_readFooter(){return Wt(this,void 0,void 0,function*(){const{_handle:t}=this;t._pending&&(yield t._pending);const e=t.size-F0,i=yield t.readInt32(e),r=yield t.readAt(e-i,i);return ju.decode(r)})}_readNextMessageAndValidate(t){return Wt(this,void 0,void 0,function*(){if(this._footer||(yield this.open()),this._footer&&this._recordBatchIndex<this.numRecordBatches){const e=this._footer.getRecordBatch(this._recordBatchIndex);if(e&&(yield this._handle.seek(e.offset)))return yield this._reader.readMessage(t)}return null})}}class q_ extends vc{constructor(t,e){super(t,e)}_loadVectors(t,e,i){return new M_(e,t.nodes,t.buffers,this.dictionaries,this.schema.metadataVersion).visitMany(i)}}function z0(n,t){return t&&typeof t.autoDestroy=="boolean"?t.autoDestroy:n.autoDestroy}function*dd(n){const t=Ki.from(n);try{if(!t.open({autoDestroy:!1}).closed)do yield t;while(!t.reset().open().closed)}finally{t.cancel()}}function fd(n){return Ti(this,arguments,function*(){const e=yield Jt(Ki.from(n));try{if(!(yield Jt(e.open({autoDestroy:!1}))).closed)do yield yield Jt(e);while(!(yield Jt(e.reset().open())).closed)}finally{yield Jt(e.cancel())}})}function Y_(n){return new xc(new q_(n))}function $_(n){const t=n.peek(Jo+7&-8);return t&&t.byteLength>=4?ih(t)?new N0(new O0(n.read())):new xc(new vc(n)):new xc(new vc((function*(){})()))}function j_(n){return Wt(this,void 0,void 0,function*(){const t=yield n.peek(Jo+7&-8);return t&&t.byteLength>=4?ih(t)?new N0(new O0(yield n.read())):new _c(new yc(n)):new _c(new yc((function(){return Ti(this,arguments,function*(){})})()))})}function J_(n){return Wt(this,void 0,void 0,function*(){const{size:t}=yield n.stat(),e=new mc(n,t);return t>=B_&&ih(yield e.readAt(0,Jo+7&-8))?new W_(new X_(e)):new _c(new yc(e))})}function V0(n){const t=Ki.from(n);return Ro(t)?t.then(e=>V0(e)):t.isAsync()?t.readAll().then(e=>new Kn(e)):new Kn(t.readAll())}const rh="181",K_=0,pd=1,Z_=2,k0=1,Q_=2,Hi=3,br=0,Mn=1,on=2,Zi=0,Ds=1,md=2,gd=3,xd=4,tv=5,Fr=100,ev=101,nv=102,iv=103,rv=104,sv=200,ov=201,av=202,cv=203,Wl=204,Xl=205,lv=206,uv=207,hv=208,dv=209,fv=210,pv=211,mv=212,gv=213,xv=214,ql=0,Yl=1,$l=2,zs=3,jl=4,Jl=5,Kl=6,Zl=7,H0=0,_v=1,vv=2,xr=0,yv=1,bv=2,Sv=3,Mv=4,wv=5,Av=6,Ev=7,G0=300,Vs=301,ks=302,Ql=303,tu=304,Uc=306,eu=1e3,ji=1001,nu=1002,Gn=1003,Tv=1004,ra=1005,Qn=1006,Zc=1007,Or=1008,Li=1009,W0=1010,X0=1011,Fo=1012,sh=1013,Hr=1014,Ci=1015,js=1016,oh=1017,ah=1018,No=1020,q0=35902,Y0=35899,$0=1021,j0=1022,hi=1023,Bo=1026,Oo=1027,ch=1028,lh=1029,uh=1030,hh=1031,dh=1033,za=33776,Va=33777,ka=33778,Ha=33779,iu=35840,ru=35841,su=35842,ou=35843,au=36196,cu=37492,lu=37496,uu=37808,hu=37809,du=37810,fu=37811,pu=37812,mu=37813,gu=37814,xu=37815,_u=37816,vu=37817,yu=37818,bu=37819,Su=37820,Mu=37821,wu=36492,Au=36494,Eu=36495,Tu=36283,Cu=36284,Ru=36285,Iu=36286,Cv=3200,Rv=3201,J0=0,Iv=1,mr="",Rn="srgb",Hs="srgb-linear",bc="linear",Se="srgb",Kr=7680,_d=519,Dv=512,Lv=513,Pv=514,K0=515,Uv=516,Fv=517,Nv=518,Bv=519,vd=35044,yd="300 es",Ri=2e3,Sc=2001;function Z0(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Mc(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Ov(){const n=Mc("canvas");return n.style.display="block",n}const bd={};function Sd(...n){const t="THREE."+n.shift();console.log(t,...n)}function Gt(...n){const t="THREE."+n.shift();console.warn(t,...n)}function qe(...n){const t="THREE."+n.shift();console.error(t,...n)}function zo(...n){const t=n.join(" ");t in bd||(bd[t]=!0,Gt(...n))}function zv(n,t,e){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}class Js{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){const i=this._listeners;if(i===void 0)return;const r=i[t];if(r!==void 0){const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,t);t.target=null}}}const un=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Md=1234567;const Mo=Math.PI/180,Vo=180/Math.PI;function Yr(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(un[n&255]+un[n>>8&255]+un[n>>16&255]+un[n>>24&255]+"-"+un[t&255]+un[t>>8&255]+"-"+un[t>>16&15|64]+un[t>>24&255]+"-"+un[e&63|128]+un[e>>8&255]+"-"+un[e>>16&255]+un[e>>24&255]+un[i&255]+un[i>>8&255]+un[i>>16&255]+un[i>>24&255]).toLowerCase()}function ee(n,t,e){return Math.max(t,Math.min(e,n))}function fh(n,t){return(n%t+t)%t}function Vv(n,t,e,i,r){return i+(n-t)*(r-i)/(e-t)}function kv(n,t,e){return n!==t?(e-n)/(t-n):0}function wo(n,t,e){return(1-e)*n+e*t}function Hv(n,t,e,i){return wo(n,t,1-Math.exp(-e*i))}function Gv(n,t=1){return t-Math.abs(fh(n,t*2)-t)}function Wv(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function Xv(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function qv(n,t){return n+Math.floor(Math.random()*(t-n+1))}function Yv(n,t){return n+Math.random()*(t-n)}function $v(n){return n*(.5-Math.random())}function jv(n){n!==void 0&&(Md=n);let t=Md+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Jv(n){return n*Mo}function Kv(n){return n*Vo}function Zv(n){return(n&n-1)===0&&n!==0}function Qv(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function ty(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function ey(n,t,e,i,r){const s=Math.cos,o=Math.sin,a=s(e/2),c=o(e/2),l=s((t+i)/2),u=o((t+i)/2),h=s((t-i)/2),d=o((t-i)/2),f=s((i-t)/2),g=o((i-t)/2);switch(r){case"XYX":n.set(a*u,c*h,c*d,a*l);break;case"YZY":n.set(c*d,a*u,c*h,a*l);break;case"ZXZ":n.set(c*h,c*d,a*u,a*l);break;case"XZX":n.set(a*u,c*g,c*f,a*l);break;case"YXY":n.set(c*f,a*u,c*g,a*l);break;case"ZYZ":n.set(c*g,c*f,a*u,a*l);break;default:Gt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Ss(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function _n(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const he={DEG2RAD:Mo,RAD2DEG:Vo,generateUUID:Yr,clamp:ee,euclideanModulo:fh,mapLinear:Vv,inverseLerp:kv,lerp:wo,damp:Hv,pingpong:Gv,smoothstep:Wv,smootherstep:Xv,randInt:qv,randFloat:Yv,randFloatSpread:$v,seededRandom:jv,degToRad:Jv,radToDeg:Kv,isPowerOfTwo:Zv,ceilPowerOfTwo:Qv,floorPowerOfTwo:ty,setQuaternionFromProperEuler:ey,normalize:_n,denormalize:Ss};class ft{constructor(t=0,e=0){ft.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6],this.y=r[1]*e+r[4]*i+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ee(this.x,t.x,e.x),this.y=ee(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ee(this.x,t,e),this.y=ee(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ee(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ee(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),r=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*r+t.x,this.y=s*r+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ji{constructor(t=0,e=0,i=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=r}static slerpFlat(t,e,i,r,s,o,a){let c=i[r+0],l=i[r+1],u=i[r+2],h=i[r+3],d=s[o+0],f=s[o+1],g=s[o+2],_=s[o+3];if(a<=0){t[e+0]=c,t[e+1]=l,t[e+2]=u,t[e+3]=h;return}if(a>=1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=_;return}if(h!==_||c!==d||l!==f||u!==g){let m=c*d+l*f+u*g+h*_;m<0&&(d=-d,f=-f,g=-g,_=-_,m=-m);let p=1-a;if(m<.9995){const A=Math.acos(m),S=Math.sin(A);p=Math.sin(p*A)/S,a=Math.sin(a*A)/S,c=c*p+d*a,l=l*p+f*a,u=u*p+g*a,h=h*p+_*a}else{c=c*p+d*a,l=l*p+f*a,u=u*p+g*a,h=h*p+_*a;const A=1/Math.sqrt(c*c+l*l+u*u+h*h);c*=A,l*=A,u*=A,h*=A}}t[e]=c,t[e+1]=l,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,i,r,s,o){const a=i[r],c=i[r+1],l=i[r+2],u=i[r+3],h=s[o],d=s[o+1],f=s[o+2],g=s[o+3];return t[e]=a*g+u*h+c*f-l*d,t[e+1]=c*g+u*d+l*h-a*f,t[e+2]=l*g+u*f+a*d-c*h,t[e+3]=u*g-a*h-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,r){return this._x=t,this._y=e,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,r=t._y,s=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(i/2),u=a(r/2),h=a(s/2),d=c(i/2),f=c(r/2),g=c(s/2);switch(o){case"XYZ":this._x=d*u*h+l*f*g,this._y=l*f*h-d*u*g,this._z=l*u*g+d*f*h,this._w=l*u*h-d*f*g;break;case"YXZ":this._x=d*u*h+l*f*g,this._y=l*f*h-d*u*g,this._z=l*u*g-d*f*h,this._w=l*u*h+d*f*g;break;case"ZXY":this._x=d*u*h-l*f*g,this._y=l*f*h+d*u*g,this._z=l*u*g+d*f*h,this._w=l*u*h-d*f*g;break;case"ZYX":this._x=d*u*h-l*f*g,this._y=l*f*h+d*u*g,this._z=l*u*g-d*f*h,this._w=l*u*h+d*f*g;break;case"YZX":this._x=d*u*h+l*f*g,this._y=l*f*h+d*u*g,this._z=l*u*g-d*f*h,this._w=l*u*h-d*f*g;break;case"XZY":this._x=d*u*h-l*f*g,this._y=l*f*h-d*u*g,this._z=l*u*g+d*f*h,this._w=l*u*h+d*f*g;break;default:Gt("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,r=Math.sin(i);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],r=e[4],s=e[8],o=e[1],a=e[5],c=e[9],l=e[2],u=e[6],h=e[10],d=i+a+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-c)*f,this._y=(s-l)*f,this._z=(o-r)*f}else if(i>a&&i>h){const f=2*Math.sqrt(1+i-a-h);this._w=(u-c)/f,this._x=.25*f,this._y=(r+o)/f,this._z=(s+l)/f}else if(a>h){const f=2*Math.sqrt(1+a-i-h);this._w=(s-l)/f,this._x=(r+o)/f,this._y=.25*f,this._z=(c+u)/f}else{const f=2*Math.sqrt(1+h-i-a);this._w=(o-r)/f,this._x=(s+l)/f,this._y=(c+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ee(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const r=Math.min(1,e/i);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,r=t._y,s=t._z,o=t._w,a=e._x,c=e._y,l=e._z,u=e._w;return this._x=i*u+o*a+r*l-s*c,this._y=r*u+o*c+s*a-i*l,this._z=s*u+o*l+i*c-r*a,this._w=o*u-i*a-r*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e<=0)return this;if(e>=1)return this.copy(t);let i=t._x,r=t._y,s=t._z,o=t._w,a=this.dot(t);a<0&&(i=-i,r=-r,s=-s,o=-o,a=-a);let c=1-e;if(a<.9995){const l=Math.acos(a),u=Math.sin(l);c=Math.sin(c*l)/u,e=Math.sin(e*l)/u,this._x=this._x*c+i*e,this._y=this._y*c+r*e,this._z=this._z*c+s*e,this._w=this._w*c+o*e,this._onChangeCallback()}else this._x=this._x*c+i*e,this._y=this._y*c+r*e,this._z=this._z*c+s*e,this._w=this._w*c+o*e,this.normalize();return this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class T{constructor(t=0,e=0,i=0){T.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(wd.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(wd.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*r,this.y=s[1]*e+s[4]*i+s[7]*r,this.z=s[2]*e+s[5]*i+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,r=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,r=this.z,s=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*r-a*i),u=2*(a*e-s*r),h=2*(s*i-o*e);return this.x=e+c*l+o*h-a*u,this.y=i+c*u+a*l-s*h,this.z=r+c*h+s*u-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*r,this.y=s[1]*e+s[5]*i+s[9]*r,this.z=s[2]*e+s[6]*i+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ee(this.x,t.x,e.x),this.y=ee(this.y,t.y,e.y),this.z=ee(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ee(this.x,t,e),this.y=ee(this.y,t,e),this.z=ee(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ee(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,r=t.y,s=t.z,o=e.x,a=e.y,c=e.z;return this.x=r*c-s*a,this.y=s*o-i*c,this.z=i*a-r*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Qc.copy(this).projectOnVector(t),this.sub(Qc)}reflect(t){return this.sub(Qc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ee(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,r=this.z-t.z;return e*e+i*i+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const r=Math.sin(e)*t;return this.x=r*Math.sin(i),this.y=Math.cos(e)*t,this.z=r*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Qc=new T,wd=new Ji;class jt{constructor(t,e,i,r,s,o,a,c,l){jt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,r,s,o,a,c,l)}set(t,e,i,r,s,o,a,c,l){const u=this.elements;return u[0]=t,u[1]=r,u[2]=a,u[3]=e,u[4]=s,u[5]=c,u[6]=i,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,r=e.elements,s=this.elements,o=i[0],a=i[3],c=i[6],l=i[1],u=i[4],h=i[7],d=i[2],f=i[5],g=i[8],_=r[0],m=r[3],p=r[6],A=r[1],S=r[4],w=r[7],I=r[2],E=r[5],D=r[8];return s[0]=o*_+a*A+c*I,s[3]=o*m+a*S+c*E,s[6]=o*p+a*w+c*D,s[1]=l*_+u*A+h*I,s[4]=l*m+u*S+h*E,s[7]=l*p+u*w+h*D,s[2]=d*_+f*A+g*I,s[5]=d*m+f*S+g*E,s[8]=d*p+f*w+g*D,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],r=t[2],s=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8];return e*o*u-e*a*l-i*s*u+i*a*c+r*s*l-r*o*c}invert(){const t=this.elements,e=t[0],i=t[1],r=t[2],s=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8],h=u*o-a*l,d=a*c-u*s,f=l*s-o*c,g=e*h+i*d+r*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=h*_,t[1]=(r*l-u*i)*_,t[2]=(a*i-r*o)*_,t[3]=d*_,t[4]=(u*e-r*c)*_,t[5]=(r*s-a*e)*_,t[6]=f*_,t[7]=(i*c-l*e)*_,t[8]=(o*e-i*s)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,r,s,o,a){const c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*o+l*a)+o+t,-r*l,r*c,-r*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(tl.makeScale(t,e)),this}rotate(t){return this.premultiply(tl.makeRotation(-t)),this}translate(t,e){return this.premultiply(tl.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let r=0;r<9;r++)if(e[r]!==i[r])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const tl=new jt,Ad=new jt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ed=new jt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function ny(){const n={enabled:!0,workingColorSpace:Hs,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===Se&&(r.r=Qi(r.r),r.g=Qi(r.g),r.b=Qi(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Se&&(r.r=Ls(r.r),r.g=Ls(r.g),r.b=Ls(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===mr?bc:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return zo("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return zo("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Hs]:{primaries:t,whitePoint:i,transfer:bc,toXYZ:Ad,fromXYZ:Ed,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Rn},outputColorSpaceConfig:{drawingBufferColorSpace:Rn}},[Rn]:{primaries:t,whitePoint:i,transfer:Se,toXYZ:Ad,fromXYZ:Ed,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Rn}}}),n}const ue=ny();function Qi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ls(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Zr;class iy{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Zr===void 0&&(Zr=Mc("canvas")),Zr.width=t.width,Zr.height=t.height;const r=Zr.getContext("2d");t instanceof ImageData?r.putImageData(t,0,0):r.drawImage(t,0,0,t.width,t.height),i=Zr}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Mc("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const r=i.getImageData(0,0,t.width,t.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Qi(s[o]/255)*255;return i.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Qi(e[i]/255)*255):e[i]=Qi(e[i]);return{data:e,width:t.width,height:t.height}}else return Gt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let ry=0;class ph{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ry++}),this.uuid=Yr(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(el(r[o].image)):s.push(el(r[o]))}else s=el(r);i.url=s}return e||(t.images[this.uuid]=i),i}}function el(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?iy.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Gt("Texture: Unable to serialize Texture."),{})}let sy=0;const nl=new T;class gn extends Js{constructor(t=gn.DEFAULT_IMAGE,e=gn.DEFAULT_MAPPING,i=ji,r=ji,s=Qn,o=Or,a=hi,c=Li,l=gn.DEFAULT_ANISOTROPY,u=mr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:sy++}),this.uuid=Yr(),this.name="",this.source=new ph(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new ft(0,0),this.repeat=new ft(1,1),this.center=new ft(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(nl).x}get height(){return this.source.getSize(nl).y}get depth(){return this.source.getSize(nl).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const i=t[e];if(i===void 0){Gt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){Gt(`Texture.setValues(): property '${e}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==G0)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case eu:t.x=t.x-Math.floor(t.x);break;case ji:t.x=t.x<0?0:1;break;case nu:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case eu:t.y=t.y-Math.floor(t.y);break;case ji:t.y=t.y<0?0:1;break;case nu:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}gn.DEFAULT_IMAGE=null;gn.DEFAULT_MAPPING=G0;gn.DEFAULT_ANISOTROPY=1;class Xe{constructor(t=0,e=0,i=0,r=1){Xe.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,r){return this.x=t,this.y=e,this.z=i,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,r=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*r+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,r,s;const c=t.elements,l=c[0],u=c[4],h=c[8],d=c[1],f=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(u-d)<.01&&Math.abs(h-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const S=(l+1)/2,w=(f+1)/2,I=(p+1)/2,E=(u+d)/4,D=(h+_)/4,O=(g+m)/4;return S>w&&S>I?S<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(S),r=E/i,s=D/i):w>I?w<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(w),i=E/r,s=O/r):I<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(I),i=D/s,r=O/s),this.set(i,r,s,e),this}let A=Math.sqrt((m-g)*(m-g)+(h-_)*(h-_)+(d-u)*(d-u));return Math.abs(A)<.001&&(A=1),this.x=(m-g)/A,this.y=(h-_)/A,this.z=(d-u)/A,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ee(this.x,t.x,e.x),this.y=ee(this.y,t.y,e.y),this.z=ee(this.z,t.z,e.z),this.w=ee(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ee(this.x,t,e),this.y=ee(this.y,t,e),this.z=ee(this.z,t,e),this.w=ee(this.w,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ee(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class oy extends Js{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Qn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new Xe(0,0,t,e),this.scissorTest=!1,this.viewport=new Xe(0,0,t,e);const r={width:t,height:e,depth:i.depth},s=new gn(r);this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(t={}){const e={minFilter:Qn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const r=Object.assign({},t.textures[e].image);this.textures[e].source=new ph(r)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Gr extends oy{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Q0 extends gn{constructor(t=null,e=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:r},this.magFilter=Gn,this.minFilter=Gn,this.wrapR=ji,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class ay extends gn{constructor(t=null,e=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:r},this.magFilter=Gn,this.minFilter=Gn,this.wrapR=ji,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class $r{constructor(t=new T(1/0,1/0,1/0),e=new T(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(ri.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(ri.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=ri.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,ri):ri.fromBufferAttribute(s,o),ri.applyMatrix4(t.matrixWorld),this.expandByPoint(ri);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),sa.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),sa.copy(i.boundingBox)),sa.applyMatrix4(t.matrixWorld),this.union(sa)}const r=t.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ri),ri.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(io),oa.subVectors(this.max,io),Qr.subVectors(t.a,io),ts.subVectors(t.b,io),es.subVectors(t.c,io),sr.subVectors(ts,Qr),or.subVectors(es,ts),Tr.subVectors(Qr,es);let e=[0,-sr.z,sr.y,0,-or.z,or.y,0,-Tr.z,Tr.y,sr.z,0,-sr.x,or.z,0,-or.x,Tr.z,0,-Tr.x,-sr.y,sr.x,0,-or.y,or.x,0,-Tr.y,Tr.x,0];return!il(e,Qr,ts,es,oa)||(e=[1,0,0,0,1,0,0,0,1],!il(e,Qr,ts,es,oa))?!1:(aa.crossVectors(sr,or),e=[aa.x,aa.y,aa.z],il(e,Qr,ts,es,oa))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ri).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ri).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Fi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Fi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Fi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Fi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Fi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Fi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Fi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Fi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Fi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Fi=[new T,new T,new T,new T,new T,new T,new T,new T],ri=new T,sa=new $r,Qr=new T,ts=new T,es=new T,sr=new T,or=new T,Tr=new T,io=new T,oa=new T,aa=new T,Cr=new T;function il(n,t,e,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){Cr.fromArray(n,s);const a=r.x*Math.abs(Cr.x)+r.y*Math.abs(Cr.y)+r.z*Math.abs(Cr.z),c=t.dot(Cr),l=e.dot(Cr),u=i.dot(Cr);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}const cy=new $r,ro=new T,rl=new T;class Ks{constructor(t=new T,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):cy.setFromPoints(t).getCenter(i);let r=0;for(let s=0,o=t.length;s<o;s++)r=Math.max(r,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ro.subVectors(t,this.center);const e=ro.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),r=(i-this.radius)*.5;this.center.addScaledVector(ro,r/i),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(rl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ro.copy(t.center).add(rl)),this.expandByPoint(ro.copy(t.center).sub(rl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Ni=new T,sl=new T,ca=new T,ar=new T,ol=new T,la=new T,al=new T;class tm{constructor(t=new T,e=new T(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ni)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Ni.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ni.copy(this.origin).addScaledVector(this.direction,e),Ni.distanceToSquared(t))}distanceSqToSegment(t,e,i,r){sl.copy(t).add(e).multiplyScalar(.5),ca.copy(e).sub(t).normalize(),ar.copy(this.origin).sub(sl);const s=t.distanceTo(e)*.5,o=-this.direction.dot(ca),a=ar.dot(this.direction),c=-ar.dot(ca),l=ar.lengthSq(),u=Math.abs(1-o*o);let h,d,f,g;if(u>0)if(h=o*c-a,d=o*a-c,g=s*u,h>=0)if(d>=-g)if(d<=g){const _=1/u;h*=_,d*=_,f=h*(h+o*d+2*a)+d*(o*h+d+2*c)+l}else d=s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*c)+l;else d=-s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*c)+l;else d<=-g?(h=Math.max(0,-(-o*s+a)),d=h>0?-s:Math.min(Math.max(-s,-c),s),f=-h*h+d*(d+2*c)+l):d<=g?(h=0,d=Math.min(Math.max(-s,-c),s),f=d*(d+2*c)+l):(h=Math.max(0,-(o*s+a)),d=h>0?s:Math.min(Math.max(-s,-c),s),f=-h*h+d*(d+2*c)+l);else d=o>0?-s:s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(sl).addScaledVector(ca,d),f}intersectSphere(t,e){Ni.subVectors(t.center,this.origin);const i=Ni.dot(this.direction),r=Ni.dot(Ni)-i*i,s=t.radius*t.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,c=i+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,r,s,o,a,c;const l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return l>=0?(i=(t.min.x-d.x)*l,r=(t.max.x-d.x)*l):(i=(t.max.x-d.x)*l,r=(t.min.x-d.x)*l),u>=0?(s=(t.min.y-d.y)*u,o=(t.max.y-d.y)*u):(s=(t.max.y-d.y)*u,o=(t.min.y-d.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(t.min.z-d.z)*h,c=(t.max.z-d.z)*h):(a=(t.max.z-d.z)*h,c=(t.min.z-d.z)*h),i>c||a>r)||((a>i||i!==i)&&(i=a),(c<r||r!==r)&&(r=c),r<0)?null:this.at(i>=0?i:r,e)}intersectsBox(t){return this.intersectBox(t,Ni)!==null}intersectTriangle(t,e,i,r,s){ol.subVectors(e,t),la.subVectors(i,t),al.crossVectors(ol,la);let o=this.direction.dot(al),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ar.subVectors(this.origin,t);const c=a*this.direction.dot(la.crossVectors(ar,la));if(c<0)return null;const l=a*this.direction.dot(ol.cross(ar));if(l<0||c+l>o)return null;const u=-a*ar.dot(al);return u<0?null:this.at(u/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class De{constructor(t,e,i,r,s,o,a,c,l,u,h,d,f,g,_,m){De.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,r,s,o,a,c,l,u,h,d,f,g,_,m)}set(t,e,i,r,s,o,a,c,l,u,h,d,f,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=r,p[1]=s,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=u,p[10]=h,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new De().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,r=1/ns.setFromMatrixColumn(t,0).length(),s=1/ns.setFromMatrixColumn(t,1).length(),o=1/ns.setFromMatrixColumn(t,2).length();return e[0]=i[0]*r,e[1]=i[1]*r,e[2]=i[2]*r,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,r=t.y,s=t.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(r),l=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(t.order==="XYZ"){const d=o*u,f=o*h,g=a*u,_=a*h;e[0]=c*u,e[4]=-c*h,e[8]=l,e[1]=f+g*l,e[5]=d-_*l,e[9]=-a*c,e[2]=_-d*l,e[6]=g+f*l,e[10]=o*c}else if(t.order==="YXZ"){const d=c*u,f=c*h,g=l*u,_=l*h;e[0]=d+_*a,e[4]=g*a-f,e[8]=o*l,e[1]=o*h,e[5]=o*u,e[9]=-a,e[2]=f*a-g,e[6]=_+d*a,e[10]=o*c}else if(t.order==="ZXY"){const d=c*u,f=c*h,g=l*u,_=l*h;e[0]=d-_*a,e[4]=-o*h,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*u,e[9]=_-d*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const d=o*u,f=o*h,g=a*u,_=a*h;e[0]=c*u,e[4]=g*l-f,e[8]=d*l+_,e[1]=c*h,e[5]=_*l+d,e[9]=f*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const d=o*c,f=o*l,g=a*c,_=a*l;e[0]=c*u,e[4]=_-d*h,e[8]=g*h+f,e[1]=h,e[5]=o*u,e[9]=-a*u,e[2]=-l*u,e[6]=f*h+g,e[10]=d-_*h}else if(t.order==="XZY"){const d=o*c,f=o*l,g=a*c,_=a*l;e[0]=c*u,e[4]=-h,e[8]=l*u,e[1]=d*h+_,e[5]=o*u,e[9]=f*h-g,e[2]=g*h-f,e[6]=a*u,e[10]=_*h+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(ly,t,uy)}lookAt(t,e,i){const r=this.elements;return Bn.subVectors(t,e),Bn.lengthSq()===0&&(Bn.z=1),Bn.normalize(),cr.crossVectors(i,Bn),cr.lengthSq()===0&&(Math.abs(i.z)===1?Bn.x+=1e-4:Bn.z+=1e-4,Bn.normalize(),cr.crossVectors(i,Bn)),cr.normalize(),ua.crossVectors(Bn,cr),r[0]=cr.x,r[4]=ua.x,r[8]=Bn.x,r[1]=cr.y,r[5]=ua.y,r[9]=Bn.y,r[2]=cr.z,r[6]=ua.z,r[10]=Bn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,r=e.elements,s=this.elements,o=i[0],a=i[4],c=i[8],l=i[12],u=i[1],h=i[5],d=i[9],f=i[13],g=i[2],_=i[6],m=i[10],p=i[14],A=i[3],S=i[7],w=i[11],I=i[15],E=r[0],D=r[4],O=r[8],b=r[12],y=r[1],L=r[5],B=r[9],k=r[13],X=r[2],W=r[6],$=r[10],Q=r[14],G=r[3],it=r[7],ot=r[11],Rt=r[15];return s[0]=o*E+a*y+c*X+l*G,s[4]=o*D+a*L+c*W+l*it,s[8]=o*O+a*B+c*$+l*ot,s[12]=o*b+a*k+c*Q+l*Rt,s[1]=u*E+h*y+d*X+f*G,s[5]=u*D+h*L+d*W+f*it,s[9]=u*O+h*B+d*$+f*ot,s[13]=u*b+h*k+d*Q+f*Rt,s[2]=g*E+_*y+m*X+p*G,s[6]=g*D+_*L+m*W+p*it,s[10]=g*O+_*B+m*$+p*ot,s[14]=g*b+_*k+m*Q+p*Rt,s[3]=A*E+S*y+w*X+I*G,s[7]=A*D+S*L+w*W+I*it,s[11]=A*O+S*B+w*$+I*ot,s[15]=A*b+S*k+w*Q+I*Rt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],r=t[8],s=t[12],o=t[1],a=t[5],c=t[9],l=t[13],u=t[2],h=t[6],d=t[10],f=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+s*c*h-r*l*h-s*a*d+i*l*d+r*a*f-i*c*f)+_*(+e*c*f-e*l*d+s*o*d-r*o*f+r*l*u-s*c*u)+m*(+e*l*h-e*a*f-s*o*h+i*o*f+s*a*u-i*l*u)+p*(-r*a*u-e*c*h+e*a*d+r*o*h-i*o*d+i*c*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],r=t[2],s=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8],h=t[9],d=t[10],f=t[11],g=t[12],_=t[13],m=t[14],p=t[15],A=h*m*l-_*d*l+_*c*f-a*m*f-h*c*p+a*d*p,S=g*d*l-u*m*l-g*c*f+o*m*f+u*c*p-o*d*p,w=u*_*l-g*h*l+g*a*f-o*_*f-u*a*p+o*h*p,I=g*h*c-u*_*c-g*a*d+o*_*d+u*a*m-o*h*m,E=e*A+i*S+r*w+s*I;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const D=1/E;return t[0]=A*D,t[1]=(_*d*s-h*m*s-_*r*f+i*m*f+h*r*p-i*d*p)*D,t[2]=(a*m*s-_*c*s+_*r*l-i*m*l-a*r*p+i*c*p)*D,t[3]=(h*c*s-a*d*s-h*r*l+i*d*l+a*r*f-i*c*f)*D,t[4]=S*D,t[5]=(u*m*s-g*d*s+g*r*f-e*m*f-u*r*p+e*d*p)*D,t[6]=(g*c*s-o*m*s-g*r*l+e*m*l+o*r*p-e*c*p)*D,t[7]=(o*d*s-u*c*s+u*r*l-e*d*l-o*r*f+e*c*f)*D,t[8]=w*D,t[9]=(g*h*s-u*_*s-g*i*f+e*_*f+u*i*p-e*h*p)*D,t[10]=(o*_*s-g*a*s+g*i*l-e*_*l-o*i*p+e*a*p)*D,t[11]=(u*a*s-o*h*s-u*i*l+e*h*l+o*i*f-e*a*f)*D,t[12]=I*D,t[13]=(u*_*r-g*h*r+g*i*d-e*_*d-u*i*m+e*h*m)*D,t[14]=(g*a*r-o*_*r-g*i*c+e*_*c+o*i*m-e*a*m)*D,t[15]=(o*h*r-u*a*r+u*i*c-e*h*c-o*i*d+e*a*d)*D,this}scale(t){const e=this.elements,i=t.x,r=t.y,s=t.z;return e[0]*=i,e[4]*=r,e[8]*=s,e[1]*=i,e[5]*=r,e[9]*=s,e[2]*=i,e[6]*=r,e[10]*=s,e[3]*=i,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,r))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),r=Math.sin(e),s=1-i,o=t.x,a=t.y,c=t.z,l=s*o,u=s*a;return this.set(l*o+i,l*a-r*c,l*c+r*a,0,l*a+r*c,u*a+i,u*c-r*o,0,l*c-r*a,u*c+r*o,s*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,r,s,o){return this.set(1,i,s,0,t,1,o,0,e,r,1,0,0,0,0,1),this}compose(t,e,i){const r=this.elements,s=e._x,o=e._y,a=e._z,c=e._w,l=s+s,u=o+o,h=a+a,d=s*l,f=s*u,g=s*h,_=o*u,m=o*h,p=a*h,A=c*l,S=c*u,w=c*h,I=i.x,E=i.y,D=i.z;return r[0]=(1-(_+p))*I,r[1]=(f+w)*I,r[2]=(g-S)*I,r[3]=0,r[4]=(f-w)*E,r[5]=(1-(d+p))*E,r[6]=(m+A)*E,r[7]=0,r[8]=(g+S)*D,r[9]=(m-A)*D,r[10]=(1-(d+_))*D,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,i){const r=this.elements;let s=ns.set(r[0],r[1],r[2]).length();const o=ns.set(r[4],r[5],r[6]).length(),a=ns.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],si.copy(this);const l=1/s,u=1/o,h=1/a;return si.elements[0]*=l,si.elements[1]*=l,si.elements[2]*=l,si.elements[4]*=u,si.elements[5]*=u,si.elements[6]*=u,si.elements[8]*=h,si.elements[9]*=h,si.elements[10]*=h,e.setFromRotationMatrix(si),i.x=s,i.y=o,i.z=a,this}makePerspective(t,e,i,r,s,o,a=Ri,c=!1){const l=this.elements,u=2*s/(e-t),h=2*s/(i-r),d=(e+t)/(e-t),f=(i+r)/(i-r);let g,_;if(c)g=s/(o-s),_=o*s/(o-s);else if(a===Ri)g=-(o+s)/(o-s),_=-2*o*s/(o-s);else if(a===Sc)g=-o/(o-s),_=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,r,s,o,a=Ri,c=!1){const l=this.elements,u=2/(e-t),h=2/(i-r),d=-(e+t)/(e-t),f=-(i+r)/(i-r);let g,_;if(c)g=1/(o-s),_=o/(o-s);else if(a===Ri)g=-2/(o-s),_=-(o+s)/(o-s);else if(a===Sc)g=-1/(o-s),_=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=h,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let r=0;r<16;r++)if(e[r]!==i[r])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const ns=new T,si=new De,ly=new T(0,0,0),uy=new T(1,1,1),cr=new T,ua=new T,Bn=new T,Td=new De,Cd=new Ji;class Pi{constructor(t=0,e=0,i=0,r=Pi.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,r=this._order){return this._x=t,this._y=e,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const r=t.elements,s=r[0],o=r[4],a=r[8],c=r[1],l=r[5],u=r[9],h=r[2],d=r[6],f=r[10];switch(e){case"XYZ":this._y=Math.asin(ee(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ee(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(ee(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-ee(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(ee(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ee(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,f),this._y=0);break;default:Gt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Td.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Td,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Cd.setFromEuler(this),this.setFromQuaternion(Cd,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Pi.DEFAULT_ORDER="XYZ";class em{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let hy=0;const Rd=new T,is=new Ji,Bi=new De,ha=new T,so=new T,dy=new T,fy=new Ji,Id=new T(1,0,0),Dd=new T(0,1,0),Ld=new T(0,0,1),Pd={type:"added"},py={type:"removed"},rs={type:"childadded",child:null},cl={type:"childremoved",child:null};class Ke extends Js{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:hy++}),this.uuid=Yr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ke.DEFAULT_UP.clone();const t=new T,e=new Pi,i=new Ji,r=new T(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new De},normalMatrix:{value:new jt}}),this.matrix=new De,this.matrixWorld=new De,this.matrixAutoUpdate=Ke.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ke.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new em,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return is.setFromAxisAngle(t,e),this.quaternion.multiply(is),this}rotateOnWorldAxis(t,e){return is.setFromAxisAngle(t,e),this.quaternion.premultiply(is),this}rotateX(t){return this.rotateOnAxis(Id,t)}rotateY(t){return this.rotateOnAxis(Dd,t)}rotateZ(t){return this.rotateOnAxis(Ld,t)}translateOnAxis(t,e){return Rd.copy(t).applyQuaternion(this.quaternion),this.position.add(Rd.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Id,t)}translateY(t){return this.translateOnAxis(Dd,t)}translateZ(t){return this.translateOnAxis(Ld,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Bi.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?ha.copy(t):ha.set(t,e,i);const r=this.parent;this.updateWorldMatrix(!0,!1),so.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Bi.lookAt(so,ha,this.up):Bi.lookAt(ha,so,this.up),this.quaternion.setFromRotationMatrix(Bi),r&&(Bi.extractRotation(r.matrixWorld),is.setFromRotationMatrix(Bi),this.quaternion.premultiply(is.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(qe("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Pd),rs.child=t,this.dispatchEvent(rs),rs.child=null):qe("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(py),cl.child=t,this.dispatchEvent(cl),cl.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Bi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Bi.multiply(t.parent.matrixWorld)),t.applyMatrix4(Bi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Pd),rs.child=t,this.dispatchEvent(rs),rs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(so,t,dy),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(so,fy,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,r=e.length;i<r;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,r=e.length;i<r;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,r=e.length;i<r;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(t),r.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const h=c[l];s(t.shapes,h)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(s(t.materials,this.material[c]));r.material=a}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];r.animations.push(s(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),u=o(t.images),h=o(t.shapes),d=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=r,i;function o(a){const c=[];for(const l in a){const u=a[l];delete u.metadata,c.push(u)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const r=t.children[i];this.add(r.clone())}return this}}Ke.DEFAULT_UP=new T(0,1,0);Ke.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ke.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const oi=new T,Oi=new T,ll=new T,zi=new T,ss=new T,os=new T,Ud=new T,ul=new T,hl=new T,dl=new T,fl=new Xe,pl=new Xe,ml=new Xe;class li{constructor(t=new T,e=new T,i=new T){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,r){r.subVectors(i,e),oi.subVectors(t,e),r.cross(oi);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,i,r,s){oi.subVectors(r,e),Oi.subVectors(i,e),ll.subVectors(t,e);const o=oi.dot(oi),a=oi.dot(Oi),c=oi.dot(ll),l=Oi.dot(Oi),u=Oi.dot(ll),h=o*l-a*a;if(h===0)return s.set(0,0,0),null;const d=1/h,f=(l*c-a*u)*d,g=(o*u-a*c)*d;return s.set(1-f-g,g,f)}static containsPoint(t,e,i,r){return this.getBarycoord(t,e,i,r,zi)===null?!1:zi.x>=0&&zi.y>=0&&zi.x+zi.y<=1}static getInterpolation(t,e,i,r,s,o,a,c){return this.getBarycoord(t,e,i,r,zi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,zi.x),c.addScaledVector(o,zi.y),c.addScaledVector(a,zi.z),c)}static getInterpolatedAttribute(t,e,i,r,s,o){return fl.setScalar(0),pl.setScalar(0),ml.setScalar(0),fl.fromBufferAttribute(t,e),pl.fromBufferAttribute(t,i),ml.fromBufferAttribute(t,r),o.setScalar(0),o.addScaledVector(fl,s.x),o.addScaledVector(pl,s.y),o.addScaledVector(ml,s.z),o}static isFrontFacing(t,e,i,r){return oi.subVectors(i,e),Oi.subVectors(t,e),oi.cross(Oi).dot(r)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,r){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,i,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return oi.subVectors(this.c,this.b),Oi.subVectors(this.a,this.b),oi.cross(Oi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return li.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return li.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,r,s){return li.getInterpolation(t,this.a,this.b,this.c,e,i,r,s)}containsPoint(t){return li.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return li.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,r=this.b,s=this.c;let o,a;ss.subVectors(r,i),os.subVectors(s,i),ul.subVectors(t,i);const c=ss.dot(ul),l=os.dot(ul);if(c<=0&&l<=0)return e.copy(i);hl.subVectors(t,r);const u=ss.dot(hl),h=os.dot(hl);if(u>=0&&h<=u)return e.copy(r);const d=c*h-u*l;if(d<=0&&c>=0&&u<=0)return o=c/(c-u),e.copy(i).addScaledVector(ss,o);dl.subVectors(t,s);const f=ss.dot(dl),g=os.dot(dl);if(g>=0&&f<=g)return e.copy(s);const _=f*l-c*g;if(_<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(i).addScaledVector(os,a);const m=u*g-f*h;if(m<=0&&h-u>=0&&f-g>=0)return Ud.subVectors(s,r),a=(h-u)/(h-u+(f-g)),e.copy(r).addScaledVector(Ud,a);const p=1/(m+_+d);return o=_*p,a=d*p,e.copy(i).addScaledVector(ss,o).addScaledVector(os,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const nm={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},lr={h:0,s:0,l:0},da={h:0,s:0,l:0};function gl(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class Zt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Rn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ue.colorSpaceToWorking(this,e),this}setRGB(t,e,i,r=ue.workingColorSpace){return this.r=t,this.g=e,this.b=i,ue.colorSpaceToWorking(this,r),this}setHSL(t,e,i,r=ue.workingColorSpace){if(t=fh(t,1),e=ee(e,0,1),i=ee(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=gl(o,s,t+1/3),this.g=gl(o,s,t),this.b=gl(o,s,t-1/3)}return ue.colorSpaceToWorking(this,r),this}setStyle(t,e=Rn){function i(s){s!==void 0&&parseFloat(s)<1&&Gt("Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:Gt("Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);Gt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Rn){const i=nm[t.toLowerCase()];return i!==void 0?this.setHex(i,e):Gt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Qi(t.r),this.g=Qi(t.g),this.b=Qi(t.b),this}copyLinearToSRGB(t){return this.r=Ls(t.r),this.g=Ls(t.g),this.b=Ls(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Rn){return ue.workingToColorSpace(hn.copy(this),t),Math.round(ee(hn.r*255,0,255))*65536+Math.round(ee(hn.g*255,0,255))*256+Math.round(ee(hn.b*255,0,255))}getHexString(t=Rn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ue.workingColorSpace){ue.workingToColorSpace(hn.copy(this),e);const i=hn.r,r=hn.g,s=hn.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let c,l;const u=(a+o)/2;if(a===o)c=0,l=0;else{const h=o-a;switch(l=u<=.5?h/(o+a):h/(2-o-a),o){case i:c=(r-s)/h+(r<s?6:0);break;case r:c=(s-i)/h+2;break;case s:c=(i-r)/h+4;break}c/=6}return t.h=c,t.s=l,t.l=u,t}getRGB(t,e=ue.workingColorSpace){return ue.workingToColorSpace(hn.copy(this),e),t.r=hn.r,t.g=hn.g,t.b=hn.b,t}getStyle(t=Rn){ue.workingToColorSpace(hn.copy(this),t);const e=hn.r,i=hn.g,r=hn.b;return t!==Rn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(t,e,i){return this.getHSL(lr),this.setHSL(lr.h+t,lr.s+e,lr.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(lr),t.getHSL(da);const i=wo(lr.h,da.h,e),r=wo(lr.s,da.s,e),s=wo(lr.l,da.l,e);return this.setHSL(i,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*r,this.g=s[1]*e+s[4]*i+s[7]*r,this.b=s[2]*e+s[5]*i+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const hn=new Zt;Zt.NAMES=nm;let my=0;class Zs extends Js{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:my++}),this.uuid=Yr(),this.name="",this.type="Material",this.blending=Ds,this.side=br,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Wl,this.blendDst=Xl,this.blendEquation=Fr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Zt(0,0,0),this.blendAlpha=0,this.depthFunc=zs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=_d,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Kr,this.stencilZFail=Kr,this.stencilZPass=Kr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){Gt(`Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){Gt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ds&&(i.blending=this.blending),this.side!==br&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Wl&&(i.blendSrc=this.blendSrc),this.blendDst!==Xl&&(i.blendDst=this.blendDst),this.blendEquation!==Fr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==zs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==_d&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Kr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Kr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Kr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const c=s[a];delete c.metadata,o.push(c)}return o}if(e){const s=r(t.textures),o=r(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const r=e.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class de extends Zs{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Pi,this.combine=H0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ye=new T,fa=new ft;let gy=0;class wn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:gy++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=vd,this.updateRanges=[],this.gpuType=Ci,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[i+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)fa.fromBufferAttribute(this,e),fa.applyMatrix3(t),this.setXY(e,fa.x,fa.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Ye.fromBufferAttribute(this,e),Ye.applyMatrix3(t),this.setXYZ(e,Ye.x,Ye.y,Ye.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Ye.fromBufferAttribute(this,e),Ye.applyMatrix4(t),this.setXYZ(e,Ye.x,Ye.y,Ye.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ye.fromBufferAttribute(this,e),Ye.applyNormalMatrix(t),this.setXYZ(e,Ye.x,Ye.y,Ye.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ye.fromBufferAttribute(this,e),Ye.transformDirection(t),this.setXYZ(e,Ye.x,Ye.y,Ye.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Ss(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=_n(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ss(e,this.array)),e}setX(t,e){return this.normalized&&(e=_n(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ss(e,this.array)),e}setY(t,e){return this.normalized&&(e=_n(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ss(e,this.array)),e}setZ(t,e){return this.normalized&&(e=_n(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ss(e,this.array)),e}setW(t,e){return this.normalized&&(e=_n(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=_n(e,this.array),i=_n(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,r){return t*=this.itemSize,this.normalized&&(e=_n(e,this.array),i=_n(i,this.array),r=_n(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=r,this}setXYZW(t,e,i,r,s){return t*=this.itemSize,this.normalized&&(e=_n(e,this.array),i=_n(i,this.array),r=_n(r,this.array),s=_n(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==vd&&(t.usage=this.usage),t}}class im extends wn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class rm extends wn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Le extends wn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let xy=0;const qn=new De,xl=new Ke,as=new T,On=new $r,oo=new $r,en=new T;class Ee extends Js{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:xy++}),this.uuid=Yr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Z0(t)?rm:im)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new jt().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return qn.makeRotationFromQuaternion(t),this.applyMatrix4(qn),this}rotateX(t){return qn.makeRotationX(t),this.applyMatrix4(qn),this}rotateY(t){return qn.makeRotationY(t),this.applyMatrix4(qn),this}rotateZ(t){return qn.makeRotationZ(t),this.applyMatrix4(qn),this}translate(t,e,i){return qn.makeTranslation(t,e,i),this.applyMatrix4(qn),this}scale(t,e,i){return qn.makeScale(t,e,i),this.applyMatrix4(qn),this}lookAt(t){return xl.lookAt(t),xl.updateMatrix(),this.applyMatrix4(xl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(as).negate(),this.translate(as.x,as.y,as.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let r=0,s=t.length;r<s;r++){const o=t[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Le(i,3))}else{const i=Math.min(t.length,e.count);for(let r=0;r<i;r++){const s=t[r];e.setXYZ(r,s.x,s.y,s.z||0)}t.length>e.count&&Gt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new $r);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){qe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new T(-1/0,-1/0,-1/0),new T(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,r=e.length;i<r;i++){const s=e[i];On.setFromBufferAttribute(s),this.morphTargetsRelative?(en.addVectors(this.boundingBox.min,On.min),this.boundingBox.expandByPoint(en),en.addVectors(this.boundingBox.max,On.max),this.boundingBox.expandByPoint(en)):(this.boundingBox.expandByPoint(On.min),this.boundingBox.expandByPoint(On.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&qe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ks);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){qe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new T,1/0);return}if(t){const i=this.boundingSphere.center;if(On.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const a=e[s];oo.setFromBufferAttribute(a),this.morphTargetsRelative?(en.addVectors(On.min,oo.min),On.expandByPoint(en),en.addVectors(On.max,oo.max),On.expandByPoint(en)):(On.expandByPoint(oo.min),On.expandByPoint(oo.max))}On.getCenter(i);let r=0;for(let s=0,o=t.count;s<o;s++)en.fromBufferAttribute(t,s),r=Math.max(r,i.distanceToSquared(en));if(e)for(let s=0,o=e.length;s<o;s++){const a=e[s],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)en.fromBufferAttribute(a,l),c&&(as.fromBufferAttribute(t,l),en.add(as)),r=Math.max(r,i.distanceToSquared(en))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&qe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){qe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,r=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new wn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let O=0;O<i.count;O++)a[O]=new T,c[O]=new T;const l=new T,u=new T,h=new T,d=new ft,f=new ft,g=new ft,_=new T,m=new T;function p(O,b,y){l.fromBufferAttribute(i,O),u.fromBufferAttribute(i,b),h.fromBufferAttribute(i,y),d.fromBufferAttribute(s,O),f.fromBufferAttribute(s,b),g.fromBufferAttribute(s,y),u.sub(l),h.sub(l),f.sub(d),g.sub(d);const L=1/(f.x*g.y-g.x*f.y);isFinite(L)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(h,-f.y).multiplyScalar(L),m.copy(h).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(L),a[O].add(_),a[b].add(_),a[y].add(_),c[O].add(m),c[b].add(m),c[y].add(m))}let A=this.groups;A.length===0&&(A=[{start:0,count:t.count}]);for(let O=0,b=A.length;O<b;++O){const y=A[O],L=y.start,B=y.count;for(let k=L,X=L+B;k<X;k+=3)p(t.getX(k+0),t.getX(k+1),t.getX(k+2))}const S=new T,w=new T,I=new T,E=new T;function D(O){I.fromBufferAttribute(r,O),E.copy(I);const b=a[O];S.copy(b),S.sub(I.multiplyScalar(I.dot(b))).normalize(),w.crossVectors(E,b);const L=w.dot(c[O])<0?-1:1;o.setXYZW(O,S.x,S.y,S.z,L)}for(let O=0,b=A.length;O<b;++O){const y=A[O],L=y.start,B=y.count;for(let k=L,X=L+B;k<X;k+=3)D(t.getX(k+0)),D(t.getX(k+1)),D(t.getX(k+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new wn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const r=new T,s=new T,o=new T,a=new T,c=new T,l=new T,u=new T,h=new T;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);r.fromBufferAttribute(e,g),s.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),a.fromBufferAttribute(i,g),c.fromBufferAttribute(i,_),l.fromBufferAttribute(i,m),a.add(u),c.add(u),l.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)r.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)en.fromBufferAttribute(t,e),en.normalize(),t.setXYZ(e,en.x,en.y,en.z)}toNonIndexed(){function t(a,c){const l=a.array,u=a.itemSize,h=a.normalized,d=new l.constructor(c.length*u);let f=0,g=0;for(let _=0,m=c.length;_<m;_++){a.isInterleavedBufferAttribute?f=c[_]*a.data.stride+a.offset:f=c[_]*u;for(let p=0;p<u;p++)d[g++]=l[f++]}return new wn(d,u,h)}if(this.index===null)return Gt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ee,i=this.index.array,r=this.attributes;for(const a in r){const c=r[a],l=t(c,i);e.setAttribute(a,l)}const s=this.morphAttributes;for(const a in s){const c=[],l=s[a];for(let u=0,h=l.length;u<h;u++){const d=l[u],f=t(d,i);c.push(f)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let h=0,d=l.length;h<d;h++){const f=l[h];u.push(f.toJSON(t.data))}u.length>0&&(r[c]=u,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone());const r=t.attributes;for(const l in r){const u=r[l];this.setAttribute(l,u.clone(e))}const s=t.morphAttributes;for(const l in s){const u=[],h=s[l];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(e));this.morphAttributes[l]=u}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,u=o.length;l<u;l++){const h=o[l];this.addGroup(h.start,h.count,h.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Fd=new De,Rr=new tm,pa=new Ks,Nd=new T,ma=new T,ga=new T,xa=new T,_l=new T,_a=new T,Bd=new T,va=new T;class mt extends Ke{constructor(t=new Ee,e=new de){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const r=e[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(t,e){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(r,t);const a=this.morphTargetInfluences;if(s&&a){_a.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const u=a[c],h=s[c];u!==0&&(_l.fromBufferAttribute(h,t),o?_a.addScaledVector(_l,u):_a.addScaledVector(_l.sub(e),u))}e.add(_a)}return e}raycast(t,e){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),pa.copy(i.boundingSphere),pa.applyMatrix4(s),Rr.copy(t.ray).recast(t.near),!(pa.containsPoint(Rr.origin)===!1&&(Rr.intersectSphere(pa,Nd)===null||Rr.origin.distanceToSquared(Nd)>(t.far-t.near)**2))&&(Fd.copy(s).invert(),Rr.copy(t.ray).applyMatrix4(Fd),!(i.boundingBox!==null&&Rr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Rr)))}_computeIntersections(t,e,i){let r;const s=this.geometry,o=this.material,a=s.index,c=s.attributes.position,l=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],A=Math.max(m.start,f.start),S=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let w=A,I=S;w<I;w+=3){const E=a.getX(w),D=a.getX(w+1),O=a.getX(w+2);r=ya(this,p,t,i,l,u,h,E,D,O),r&&(r.faceIndex=Math.floor(w/3),r.face.materialIndex=m.materialIndex,e.push(r))}}else{const g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const A=a.getX(m),S=a.getX(m+1),w=a.getX(m+2);r=ya(this,o,t,i,l,u,h,A,S,w),r&&(r.faceIndex=Math.floor(m/3),e.push(r))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],A=Math.max(m.start,f.start),S=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let w=A,I=S;w<I;w+=3){const E=w,D=w+1,O=w+2;r=ya(this,p,t,i,l,u,h,E,D,O),r&&(r.faceIndex=Math.floor(w/3),r.face.materialIndex=m.materialIndex,e.push(r))}}else{const g=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const A=m,S=m+1,w=m+2;r=ya(this,o,t,i,l,u,h,A,S,w),r&&(r.faceIndex=Math.floor(m/3),e.push(r))}}}}function _y(n,t,e,i,r,s,o,a){let c;if(t.side===Mn?c=i.intersectTriangle(o,s,r,!0,a):c=i.intersectTriangle(r,s,o,t.side===br,a),c===null)return null;va.copy(a),va.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(va);return l<e.near||l>e.far?null:{distance:l,point:va.clone(),object:n}}function ya(n,t,e,i,r,s,o,a,c,l){n.getVertexPosition(a,ma),n.getVertexPosition(c,ga),n.getVertexPosition(l,xa);const u=_y(n,t,e,i,ma,ga,xa,Bd);if(u){const h=new T;li.getBarycoord(Bd,ma,ga,xa,h),r&&(u.uv=li.getInterpolatedAttribute(r,a,c,l,h,new ft)),s&&(u.uv1=li.getInterpolatedAttribute(s,a,c,l,h,new ft)),o&&(u.normal=li.getInterpolatedAttribute(o,a,c,l,h,new T),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:c,c:l,normal:new T,materialIndex:0};li.getNormal(ma,ga,xa,d.normal),u.face=d,u.barycoord=h}return u}class cn extends Ee{constructor(t=1,e=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const c=[],l=[],u=[],h=[];let d=0,f=0;g("z","y","x",-1,-1,i,e,t,o,s,0),g("z","y","x",1,-1,i,e,-t,o,s,1),g("x","z","y",1,1,t,i,e,r,o,2),g("x","z","y",1,-1,t,i,-e,r,o,3),g("x","y","z",1,-1,t,e,i,r,s,4),g("x","y","z",-1,-1,t,e,-i,r,s,5),this.setIndex(c),this.setAttribute("position",new Le(l,3)),this.setAttribute("normal",new Le(u,3)),this.setAttribute("uv",new Le(h,2));function g(_,m,p,A,S,w,I,E,D,O,b){const y=w/D,L=I/O,B=w/2,k=I/2,X=E/2,W=D+1,$=O+1;let Q=0,G=0;const it=new T;for(let ot=0;ot<$;ot++){const Rt=ot*L-k;for(let ae=0;ae<W;ae++){const ve=ae*y-B;it[_]=ve*A,it[m]=Rt*S,it[p]=X,l.push(it.x,it.y,it.z),it[_]=0,it[m]=0,it[p]=E>0?1:-1,u.push(it.x,it.y,it.z),h.push(ae/D),h.push(1-ot/O),Q+=1}}for(let ot=0;ot<O;ot++)for(let Rt=0;Rt<D;Rt++){const ae=d+Rt+W*ot,ve=d+Rt+W*(ot+1),Te=d+(Rt+1)+W*(ot+1),Ce=d+(Rt+1)+W*ot;c.push(ae,ve,Ce),c.push(ve,Te,Ce),G+=6}a.addGroup(f,G,b),f+=G,d+=Q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new cn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Gs(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const r=n[e][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(Gt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=r.clone():Array.isArray(r)?t[e][i]=r.slice():t[e][i]=r}}return t}function vn(n){const t={};for(let e=0;e<n.length;e++){const i=Gs(n[e]);for(const r in i)t[r]=i[r]}return t}function vy(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function sm(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ue.workingColorSpace}const yy={clone:Gs,merge:vn};var by=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Sy=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class er extends Zs{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=by,this.fragmentShader=Sy,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Gs(t.uniforms),this.uniformsGroups=vy(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?e.uniforms[r]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[r]={type:"m4",value:o.toArray()}:e.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class om extends Ke{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new De,this.projectionMatrix=new De,this.projectionMatrixInverse=new De,this.coordinateSystem=Ri,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ur=new T,Od=new ft,zd=new ft;class Zn extends om{constructor(t=50,e=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Vo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Mo*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Vo*2*Math.atan(Math.tan(Mo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){ur.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ur.x,ur.y).multiplyScalar(-t/ur.z),ur.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ur.x,ur.y).multiplyScalar(-t/ur.z)}getViewSize(t,e){return this.getViewBounds(t,Od,zd),e.subVectors(zd,Od)}setViewOffset(t,e,i,r,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Mo*.5*this.fov)/this.zoom,i=2*e,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*r/c,e-=o.offsetY*i/l,r*=o.width/c,i*=o.height/l}const a=this.filmOffset;a!==0&&(s+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const cs=-90,ls=1;class My extends Ke{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Zn(cs,ls,t,e);r.layers=this.layers,this.add(r);const s=new Zn(cs,ls,t,e);s.layers=this.layers,this.add(s);const o=new Zn(cs,ls,t,e);o.layers=this.layers,this.add(o);const a=new Zn(cs,ls,t,e);a.layers=this.layers,this.add(a);const c=new Zn(cs,ls,t,e);c.layers=this.layers,this.add(c);const l=new Zn(cs,ls,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,r,s,o,a,c]=e;for(const l of e)this.remove(l);if(t===Ri)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Sc)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,c,l,u]=this.children,h=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,r),t.render(e,s),t.setRenderTarget(i,1,r),t.render(e,o),t.setRenderTarget(i,2,r),t.render(e,a),t.setRenderTarget(i,3,r),t.render(e,c),t.setRenderTarget(i,4,r),t.render(e,l),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,r),t.render(e,u),t.setRenderTarget(h,d,f),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class am extends gn{constructor(t=[],e=Vs,i,r,s,o,a,c,l,u){super(t,e,i,r,s,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class wy extends Gr{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},r=[i,i,i,i,i,i];this.texture=new am(r),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new cn(5,5,5),s=new er({name:"CubemapFromEquirect",uniforms:Gs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Mn,blending:Zi});s.uniforms.tEquirect.value=e;const o=new mt(r,s),a=e.minFilter;return e.minFilter===Or&&(e.minFilter=Qn),new My(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,i=!0,r=!0){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,r);t.setRenderTarget(s)}}class Ae extends Ke{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Ay={type:"move"};class vl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ae,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ae,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new T,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new T),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ae,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new T,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new T),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let r=null,s=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,i),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(r=e.getPose(t.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Ay)))}return a!==null&&(a.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Ae;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}class mh{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Zt(t),this.density=e}clone(){return new mh(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Ey extends Ke{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Pi,this.environmentIntensity=1,this.environmentRotation=new Pi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class cm extends gn{constructor(t=null,e=1,i=1,r,s,o,a,c,l=Gn,u=Gn,h,d){super(null,o,a,c,l,u,r,s,h,d),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Vd extends wn{constructor(t,e,i,r=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const us=new De,kd=new De,ba=[],Hd=new $r,Ty=new De,ao=new mt,co=new Ks;class Gd extends mt{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Vd(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,Ty)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new $r),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,us),Hd.copy(t.boundingBox).applyMatrix4(us),this.boundingBox.union(Hd)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ks),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,us),co.copy(t.boundingSphere).applyMatrix4(us),this.boundingSphere.union(co)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const i=e.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,o=t*s+1;for(let a=0;a<i.length;a++)i[a]=r[o+a]}raycast(t,e){const i=this.matrixWorld,r=this.count;if(ao.geometry=this.geometry,ao.material=this.material,ao.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),co.copy(this.boundingSphere),co.applyMatrix4(i),t.ray.intersectsSphere(co)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,us),kd.multiplyMatrices(i,us),ao.matrixWorld=kd,ao.raycast(t,ba);for(let o=0,a=ba.length;o<a;o++){const c=ba[o];c.instanceId=s,c.object=this,e.push(c)}ba.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Vd(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const i=e.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new cm(new Float32Array(r*this.count),r,this.count,ch,Ci));const s=this.morphTexture.source.data.data;let o=0;for(let l=0;l<i.length;l++)o+=i[l];const a=this.geometry.morphTargetsRelative?1:1-o,c=r*t;s[c]=a,s.set(i,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const yl=new T,Cy=new T,Ry=new jt;class Ur{constructor(t=new T(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,r){return this.normal.set(t,e,i),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const r=yl.subVectors(i,e).cross(Cy.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(yl),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Ry.getNormalMatrix(t),r=this.coplanarPoint(yl).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ir=new Ks,Iy=new ft(.5,.5),Sa=new T;class gh{constructor(t=new Ur,e=new Ur,i=new Ur,r=new Ur,s=new Ur,o=new Ur){this.planes=[t,e,i,r,s,o]}set(t,e,i,r,s,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Ri,i=!1){const r=this.planes,s=t.elements,o=s[0],a=s[1],c=s[2],l=s[3],u=s[4],h=s[5],d=s[6],f=s[7],g=s[8],_=s[9],m=s[10],p=s[11],A=s[12],S=s[13],w=s[14],I=s[15];if(r[0].setComponents(l-o,f-u,p-g,I-A).normalize(),r[1].setComponents(l+o,f+u,p+g,I+A).normalize(),r[2].setComponents(l+a,f+h,p+_,I+S).normalize(),r[3].setComponents(l-a,f-h,p-_,I-S).normalize(),i)r[4].setComponents(c,d,m,w).normalize(),r[5].setComponents(l-c,f-d,p-m,I-w).normalize();else if(r[4].setComponents(l-c,f-d,p-m,I-w).normalize(),e===Ri)r[5].setComponents(l+c,f+d,p+m,I+w).normalize();else if(e===Sc)r[5].setComponents(c,d,m,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ir.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ir.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ir)}intersectsSprite(t){Ir.center.set(0,0,0);const e=Iy.distanceTo(t.center);return Ir.radius=.7071067811865476+e,Ir.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ir)}intersectsSphere(t){const e=this.planes,i=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const r=e[i];if(Sa.x=r.normal.x>0?t.max.x:t.min.x,Sa.y=r.normal.y>0?t.max.y:t.min.y,Sa.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(Sa)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Pn extends Zs{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Zt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const wc=new T,Ac=new T,Wd=new De,lo=new tm,Ma=new Ks,bl=new T,Xd=new T;class Un extends Ke{constructor(t=new Ee,e=new Pn){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let r=1,s=e.count;r<s;r++)wc.fromBufferAttribute(e,r-1),Ac.fromBufferAttribute(e,r),i[r]=i[r-1],i[r]+=wc.distanceTo(Ac);t.setAttribute("lineDistance",new Le(i,1))}else Gt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,r=this.matrixWorld,s=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ma.copy(i.boundingSphere),Ma.applyMatrix4(r),Ma.radius+=s,t.ray.intersectsSphere(Ma)===!1)return;Wd.copy(r).invert(),lo.copy(t.ray).applyMatrix4(Wd);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,u=i.index,d=i.attributes.position;if(u!==null){const f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=l){const p=u.getX(_),A=u.getX(_+1),S=wa(this,t,lo,c,p,A,_);S&&e.push(S)}if(this.isLineLoop){const _=u.getX(g-1),m=u.getX(f),p=wa(this,t,lo,c,_,m,g-1);p&&e.push(p)}}else{const f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=l){const p=wa(this,t,lo,c,_,_+1,_);p&&e.push(p)}if(this.isLineLoop){const _=wa(this,t,lo,c,g-1,f,g-1);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const r=e[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function wa(n,t,e,i,r,s,o){const a=n.geometry.attributes.position;if(wc.fromBufferAttribute(a,r),Ac.fromBufferAttribute(a,s),e.distanceSqToSegment(wc,Ac,bl,Xd)>i)return;bl.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(bl);if(!(l<t.near||l>t.far))return{distance:l,point:Xd.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}const qd=new T,Yd=new T;class Dy extends Un{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let r=0,s=e.count;r<s;r+=2)qd.fromBufferAttribute(e,r),Yd.fromBufferAttribute(e,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+qd.distanceTo(Yd);t.setAttribute("lineDistance",new Le(i,1))}else Gt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Ly extends Un{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}}class lm extends gn{constructor(t,e,i,r,s,o,a,c,l){super(t,e,i,r,s,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class um extends gn{constructor(t,e,i=Hr,r,s,o,a=Gn,c=Gn,l,u=Bo,h=1){if(u!==Bo&&u!==Oo)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:h};super(d,r,s,o,a,c,u,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new ph(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class hm extends gn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Wr extends Ee{constructor(t=1,e=32,i=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:r},e=Math.max(3,e);const s=[],o=[],a=[],c=[],l=new T,u=new ft;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let h=0,d=3;h<=e;h++,d+=3){const f=i+h/e*r;l.x=t*Math.cos(f),l.y=t*Math.sin(f),o.push(l.x,l.y,l.z),a.push(0,0,1),u.x=(o[d]/t+1)/2,u.y=(o[d+1]/t+1)/2,c.push(u.x,u.y)}for(let h=1;h<=e;h++)s.push(h,h+1,0);this.setIndex(s),this.setAttribute("position",new Le(o,3)),this.setAttribute("normal",new Le(a,3)),this.setAttribute("uv",new Le(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Wr(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class pi extends Ee{constructor(t=1,e=1,i=1,r=32,s=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:c};const l=this;r=Math.floor(r),s=Math.floor(s);const u=[],h=[],d=[],f=[];let g=0;const _=[],m=i/2;let p=0;A(),o===!1&&(t>0&&S(!0),e>0&&S(!1)),this.setIndex(u),this.setAttribute("position",new Le(h,3)),this.setAttribute("normal",new Le(d,3)),this.setAttribute("uv",new Le(f,2));function A(){const w=new T,I=new T;let E=0;const D=(e-t)/i;for(let O=0;O<=s;O++){const b=[],y=O/s,L=y*(e-t)+t;for(let B=0;B<=r;B++){const k=B/r,X=k*c+a,W=Math.sin(X),$=Math.cos(X);I.x=L*W,I.y=-y*i+m,I.z=L*$,h.push(I.x,I.y,I.z),w.set(W,D,$).normalize(),d.push(w.x,w.y,w.z),f.push(k,1-y),b.push(g++)}_.push(b)}for(let O=0;O<r;O++)for(let b=0;b<s;b++){const y=_[b][O],L=_[b+1][O],B=_[b+1][O+1],k=_[b][O+1];(t>0||b!==0)&&(u.push(y,L,k),E+=3),(e>0||b!==s-1)&&(u.push(L,B,k),E+=3)}l.addGroup(p,E,0),p+=E}function S(w){const I=g,E=new ft,D=new T;let O=0;const b=w===!0?t:e,y=w===!0?1:-1;for(let B=1;B<=r;B++)h.push(0,m*y,0),d.push(0,y,0),f.push(.5,.5),g++;const L=g;for(let B=0;B<=r;B++){const X=B/r*c+a,W=Math.cos(X),$=Math.sin(X);D.x=b*$,D.y=m*y,D.z=b*W,h.push(D.x,D.y,D.z),d.push(0,y,0),E.x=W*.5+.5,E.y=$*.5*y+.5,f.push(E.x,E.y),g++}for(let B=0;B<r;B++){const k=I+B,X=L+B;w===!0?u.push(X,X+1,k):u.push(X+1,X,k),O+=3}l.addGroup(p,O,w===!0?1:2),p+=O}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new pi(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Qs extends pi{constructor(t=1,e=1,i=32,r=1,s=!1,o=0,a=Math.PI*2){super(0,t,e,i,r,s,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:r,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Qs(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ui{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Gt("Curve: .getPoint() not implemented.")}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,r=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),s+=i.distanceTo(r),e.push(s),r=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const i=this.getLengths();let r=0;const s=i.length;let o;e?o=e:o=t*i[s-1];let a=0,c=s-1,l;for(;a<=c;)if(r=Math.floor(a+(c-a)/2),l=i[r]-o,l<0)a=r+1;else if(l>0)c=r-1;else{c=r;break}if(r=c,i[r]===o)return r/(s-1);const u=i[r],d=i[r+1]-u,f=(o-u)/d;return(r+f)/(s-1)}getTangent(t,e){let r=t-1e-4,s=t+1e-4;r<0&&(r=0),s>1&&(s=1);const o=this.getPoint(r),a=this.getPoint(s),c=e||(o.isVector2?new ft:new T);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e=!1){const i=new T,r=[],s=[],o=[],a=new T,c=new De;for(let f=0;f<=t;f++){const g=f/t;r[f]=this.getTangentAt(g,new T)}s[0]=new T,o[0]=new T;let l=Number.MAX_VALUE;const u=Math.abs(r[0].x),h=Math.abs(r[0].y),d=Math.abs(r[0].z);u<=l&&(l=u,i.set(1,0,0)),h<=l&&(l=h,i.set(0,1,0)),d<=l&&i.set(0,0,1),a.crossVectors(r[0],i).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(r[f-1],r[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(ee(r[f-1].dot(r[f]),-1,1));s[f].applyMatrix4(c.makeRotationAxis(a,g))}o[f].crossVectors(r[f],s[f])}if(e===!0){let f=Math.acos(ee(s[0].dot(s[t]),-1,1));f/=t,r[0].dot(a.crossVectors(s[0],s[t]))>0&&(f=-f);for(let g=1;g<=t;g++)s[g].applyMatrix4(c.makeRotationAxis(r[g],f*g)),o[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Fc extends Ui{constructor(t=0,e=0,i=1,r=1,s=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new ft){const i=e,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(o?s=0:s=r),this.aClockwise===!0&&!o&&(s===r?s=-r:s=s-r);const a=this.aStartAngle+t*s;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*u-f*h+this.aX,l=d*h+f*u+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Py extends Fc{constructor(t,e,i,r,s,o){super(t,e,i,i,r,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function xh(){let n=0,t=0,e=0,i=0;function r(s,o,a,c){n=s,t=a,e=-3*s+3*o-2*a-c,i=2*s-2*o+a+c}return{initCatmullRom:function(s,o,a,c,l){r(o,a,l*(a-s),l*(c-o))},initNonuniformCatmullRom:function(s,o,a,c,l,u,h){let d=(o-s)/l-(a-s)/(l+u)+(a-o)/u,f=(a-o)/u-(c-o)/(u+h)+(c-a)/h;d*=u,f*=u,r(o,a,d,f)},calc:function(s){const o=s*s,a=o*s;return n+t*s+e*o+i*a}}}const Aa=new T,Sl=new xh,Ml=new xh,wl=new xh;class Uy extends Ui{constructor(t=[],e=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=r}getPoint(t,e=new T){const i=e,r=this.points,s=r.length,o=(s-(this.closed?0:1))*t;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:c===0&&a===s-1&&(a=s-2,c=1);let l,u;this.closed||a>0?l=r[(a-1)%s]:(Aa.subVectors(r[0],r[1]).add(r[0]),l=Aa);const h=r[a%s],d=r[(a+1)%s];if(this.closed||a+2<s?u=r[(a+2)%s]:(Aa.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=Aa),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(h),f),_=Math.pow(h.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(u),f);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),Sl.initNonuniformCatmullRom(l.x,h.x,d.x,u.x,g,_,m),Ml.initNonuniformCatmullRom(l.y,h.y,d.y,u.y,g,_,m),wl.initNonuniformCatmullRom(l.z,h.z,d.z,u.z,g,_,m)}else this.curveType==="catmullrom"&&(Sl.initCatmullRom(l.x,h.x,d.x,u.x,this.tension),Ml.initCatmullRom(l.y,h.y,d.y,u.y,this.tension),wl.initCatmullRom(l.z,h.z,d.z,u.z,this.tension));return i.set(Sl.calc(c),Ml.calc(c),wl.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const r=t.points[e];this.points.push(r.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const r=this.points[e];t.points.push(r.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const r=t.points[e];this.points.push(new T().fromArray(r))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function $d(n,t,e,i,r){const s=(i-t)*.5,o=(r-e)*.5,a=n*n,c=n*a;return(2*e-2*i+s+o)*c+(-3*e+3*i-2*s-o)*a+s*n+e}function Fy(n,t){const e=1-n;return e*e*t}function Ny(n,t){return 2*(1-n)*n*t}function By(n,t){return n*n*t}function Ao(n,t,e,i){return Fy(n,t)+Ny(n,e)+By(n,i)}function Oy(n,t){const e=1-n;return e*e*e*t}function zy(n,t){const e=1-n;return 3*e*e*n*t}function Vy(n,t){return 3*(1-n)*n*n*t}function ky(n,t){return n*n*n*t}function Eo(n,t,e,i,r){return Oy(n,t)+zy(n,e)+Vy(n,i)+ky(n,r)}class dm extends Ui{constructor(t=new ft,e=new ft,i=new ft,r=new ft){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=r}getPoint(t,e=new ft){const i=e,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(Eo(t,r.x,s.x,o.x,a.x),Eo(t,r.y,s.y,o.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Hy extends Ui{constructor(t=new T,e=new T,i=new T,r=new T){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=r}getPoint(t,e=new T){const i=e,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(Eo(t,r.x,s.x,o.x,a.x),Eo(t,r.y,s.y,o.y,a.y),Eo(t,r.z,s.z,o.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class fm extends Ui{constructor(t=new ft,e=new ft){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ft){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ft){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Gy extends Ui{constructor(t=new T,e=new T){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new T){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new T){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class pm extends Ui{constructor(t=new ft,e=new ft,i=new ft){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new ft){const i=e,r=this.v0,s=this.v1,o=this.v2;return i.set(Ao(t,r.x,s.x,o.x),Ao(t,r.y,s.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Wy extends Ui{constructor(t=new T,e=new T,i=new T){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new T){const i=e,r=this.v0,s=this.v1,o=this.v2;return i.set(Ao(t,r.x,s.x,o.x),Ao(t,r.y,s.y,o.y),Ao(t,r.z,s.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class mm extends Ui{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ft){const i=e,r=this.points,s=(r.length-1)*t,o=Math.floor(s),a=s-o,c=r[o===0?o:o-1],l=r[o],u=r[o>r.length-2?r.length-1:o+1],h=r[o>r.length-3?r.length-1:o+2];return i.set($d(a,c.x,l.x,u.x,h.x),$d(a,c.y,l.y,u.y,h.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const r=t.points[e];this.points.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const r=this.points[e];t.points.push(r.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const r=t.points[e];this.points.push(new ft().fromArray(r))}return this}}var jd=Object.freeze({__proto__:null,ArcCurve:Py,CatmullRomCurve3:Uy,CubicBezierCurve:dm,CubicBezierCurve3:Hy,EllipseCurve:Fc,LineCurve:fm,LineCurve3:Gy,QuadraticBezierCurve:pm,QuadraticBezierCurve3:Wy,SplineCurve:mm});class Xy extends Ui{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new jd[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=i){const o=r[s]-i,a=this.curves[s],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,r=this.curves.length;i<r;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let r=0,s=this.curves;r<s.length;r++){const o=s[r],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){const u=c[l];i&&i.equals(u)||(e.push(u),i=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const r=t.curves[e];this.curves.push(r.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const r=this.curves[e];t.curves.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const r=t.curves[e];this.curves.push(new jd[r.type]().fromJSON(r))}return this}}class Jd extends Xy{constructor(t){super(),this.type="Path",this.currentPoint=new ft,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new fm(this.currentPoint.clone(),new ft(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,r){const s=new pm(this.currentPoint.clone(),new ft(t,e),new ft(i,r));return this.curves.push(s),this.currentPoint.set(i,r),this}bezierCurveTo(t,e,i,r,s,o){const a=new dm(this.currentPoint.clone(),new ft(t,e),new ft(i,r),new ft(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new mm(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,r,s,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,i,r,s,o),this}absarc(t,e,i,r,s,o){return this.absellipse(t,e,i,i,r,s,o),this}ellipse(t,e,i,r,s,o,a,c){const l=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+l,e+u,i,r,s,o,a,c),this}absellipse(t,e,i,r,s,o,a,c){const l=new Fc(t,e,i,r,s,o,a,c);if(this.curves.length>0){const h=l.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(l);const u=l.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class _h extends Jd{constructor(t){super(t),this.uuid=Yr(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,r=this.holes.length;i<r;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const r=t.holes[e];this.holes.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const r=this.holes[e];t.holes.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const r=t.holes[e];this.holes.push(new Jd().fromJSON(r))}return this}}function qy(n,t,e=2){const i=t&&t.length,r=i?t[0]*e:n.length;let s=gm(n,0,r,e,!0);const o=[];if(!s||s.next===s.prev)return o;let a,c,l;if(i&&(s=Ky(n,t,s,e)),n.length>80*e){a=n[0],c=n[1];let u=a,h=c;for(let d=e;d<r;d+=e){const f=n[d],g=n[d+1];f<a&&(a=f),g<c&&(c=g),f>u&&(u=f),g>h&&(h=g)}l=Math.max(u-a,h-c),l=l!==0?32767/l:0}return ko(s,o,e,a,c,l,0),o}function gm(n,t,e,i,r){let s;if(r===cb(n,t,e,i)>0)for(let o=t;o<e;o+=i)s=Kd(o/i|0,n[o],n[o+1],s);else for(let o=e-i;o>=t;o-=i)s=Kd(o/i|0,n[o],n[o+1],s);return s&&Ws(s,s.next)&&(Go(s),s=s.next),s}function Xr(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(Ws(e,e.next)||ke(e.prev,e,e.next)===0)){if(Go(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function ko(n,t,e,i,r,s,o){if(!n)return;!o&&s&&nb(n,i,r,s);let a=n;for(;n.prev!==n.next;){const c=n.prev,l=n.next;if(s?$y(n,i,r,s):Yy(n)){t.push(c.i,n.i,l.i),Go(n),n=l.next,a=l.next;continue}if(n=l,n===a){o?o===1?(n=jy(Xr(n),t),ko(n,t,e,i,r,s,2)):o===2&&Jy(n,t,e,i,r,s):ko(Xr(n),t,e,i,r,s,1);break}}}function Yy(n){const t=n.prev,e=n,i=n.next;if(ke(t,e,i)>=0)return!1;const r=t.x,s=e.x,o=i.x,a=t.y,c=e.y,l=i.y,u=Math.min(r,s,o),h=Math.min(a,c,l),d=Math.max(r,s,o),f=Math.max(a,c,l);let g=i.next;for(;g!==t;){if(g.x>=u&&g.x<=d&&g.y>=h&&g.y<=f&&yo(r,a,s,c,o,l,g.x,g.y)&&ke(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function $y(n,t,e,i){const r=n.prev,s=n,o=n.next;if(ke(r,s,o)>=0)return!1;const a=r.x,c=s.x,l=o.x,u=r.y,h=s.y,d=o.y,f=Math.min(a,c,l),g=Math.min(u,h,d),_=Math.max(a,c,l),m=Math.max(u,h,d),p=Du(f,g,t,e,i),A=Du(_,m,t,e,i);let S=n.prevZ,w=n.nextZ;for(;S&&S.z>=p&&w&&w.z<=A;){if(S.x>=f&&S.x<=_&&S.y>=g&&S.y<=m&&S!==r&&S!==o&&yo(a,u,c,h,l,d,S.x,S.y)&&ke(S.prev,S,S.next)>=0||(S=S.prevZ,w.x>=f&&w.x<=_&&w.y>=g&&w.y<=m&&w!==r&&w!==o&&yo(a,u,c,h,l,d,w.x,w.y)&&ke(w.prev,w,w.next)>=0))return!1;w=w.nextZ}for(;S&&S.z>=p;){if(S.x>=f&&S.x<=_&&S.y>=g&&S.y<=m&&S!==r&&S!==o&&yo(a,u,c,h,l,d,S.x,S.y)&&ke(S.prev,S,S.next)>=0)return!1;S=S.prevZ}for(;w&&w.z<=A;){if(w.x>=f&&w.x<=_&&w.y>=g&&w.y<=m&&w!==r&&w!==o&&yo(a,u,c,h,l,d,w.x,w.y)&&ke(w.prev,w,w.next)>=0)return!1;w=w.nextZ}return!0}function jy(n,t){let e=n;do{const i=e.prev,r=e.next.next;!Ws(i,r)&&_m(i,e,e.next,r)&&Ho(i,r)&&Ho(r,i)&&(t.push(i.i,e.i,r.i),Go(e),Go(e.next),e=n=r),e=e.next}while(e!==n);return Xr(e)}function Jy(n,t,e,i,r,s){let o=n;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&sb(o,a)){let c=vm(o,a);o=Xr(o,o.next),c=Xr(c,c.next),ko(o,t,e,i,r,s,0),ko(c,t,e,i,r,s,0);return}a=a.next}o=o.next}while(o!==n)}function Ky(n,t,e,i){const r=[];for(let s=0,o=t.length;s<o;s++){const a=t[s]*i,c=s<o-1?t[s+1]*i:n.length,l=gm(n,a,c,i,!1);l===l.next&&(l.steiner=!0),r.push(rb(l))}r.sort(Zy);for(let s=0;s<r.length;s++)e=Qy(r[s],e);return e}function Zy(n,t){let e=n.x-t.x;if(e===0&&(e=n.y-t.y,e===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),r=(t.next.y-t.y)/(t.next.x-t.x);e=i-r}return e}function Qy(n,t){const e=tb(n,t);if(!e)return t;const i=vm(e,n);return Xr(i,i.next),Xr(e,e.next)}function tb(n,t){let e=t;const i=n.x,r=n.y;let s=-1/0,o;if(Ws(n,e))return e;do{if(Ws(n,e.next))return e.next;if(r<=e.y&&r>=e.next.y&&e.next.y!==e.y){const h=e.x+(r-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(h<=i&&h>s&&(s=h,o=e.x<e.next.x?e:e.next,h===i))return o}e=e.next}while(e!==t);if(!o)return null;const a=o,c=o.x,l=o.y;let u=1/0;e=o;do{if(i>=e.x&&e.x>=c&&i!==e.x&&xm(r<l?i:s,r,c,l,r<l?s:i,r,e.x,e.y)){const h=Math.abs(r-e.y)/(i-e.x);Ho(e,n)&&(h<u||h===u&&(e.x>o.x||e.x===o.x&&eb(o,e)))&&(o=e,u=h)}e=e.next}while(e!==a);return o}function eb(n,t){return ke(n.prev,n,t.prev)<0&&ke(t.next,n,n.next)<0}function nb(n,t,e,i){let r=n;do r.z===0&&(r.z=Du(r.x,r.y,t,e,i)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==n);r.prevZ.nextZ=null,r.prevZ=null,ib(r)}function ib(n){let t,e=1;do{let i=n,r;n=null;let s=null;for(t=0;i;){t++;let o=i,a=0;for(let l=0;l<e&&(a++,o=o.nextZ,!!o);l++);let c=e;for(;a>0||c>0&&o;)a!==0&&(c===0||!o||i.z<=o.z)?(r=i,i=i.nextZ,a--):(r=o,o=o.nextZ,c--),s?s.nextZ=r:n=r,r.prevZ=s,s=r;i=o}s.nextZ=null,e*=2}while(t>1);return n}function Du(n,t,e,i,r){return n=(n-e)*r|0,t=(t-i)*r|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function rb(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function xm(n,t,e,i,r,s,o,a){return(r-o)*(t-a)>=(n-o)*(s-a)&&(n-o)*(i-a)>=(e-o)*(t-a)&&(e-o)*(s-a)>=(r-o)*(i-a)}function yo(n,t,e,i,r,s,o,a){return!(n===o&&t===a)&&xm(n,t,e,i,r,s,o,a)}function sb(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!ob(n,t)&&(Ho(n,t)&&Ho(t,n)&&ab(n,t)&&(ke(n.prev,n,t.prev)||ke(n,t.prev,t))||Ws(n,t)&&ke(n.prev,n,n.next)>0&&ke(t.prev,t,t.next)>0)}function ke(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function Ws(n,t){return n.x===t.x&&n.y===t.y}function _m(n,t,e,i){const r=Ta(ke(n,t,e)),s=Ta(ke(n,t,i)),o=Ta(ke(e,i,n)),a=Ta(ke(e,i,t));return!!(r!==s&&o!==a||r===0&&Ea(n,e,t)||s===0&&Ea(n,i,t)||o===0&&Ea(e,n,i)||a===0&&Ea(e,t,i))}function Ea(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Ta(n){return n>0?1:n<0?-1:0}function ob(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&_m(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function Ho(n,t){return ke(n.prev,n,n.next)<0?ke(n,t,n.next)>=0&&ke(n,n.prev,t)>=0:ke(n,t,n.prev)<0||ke(n,n.next,t)<0}function ab(n,t){let e=n,i=!1;const r=(n.x+t.x)/2,s=(n.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&r<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function vm(n,t){const e=Lu(n.i,n.x,n.y),i=Lu(t.i,t.x,t.y),r=n.next,s=t.prev;return n.next=t,t.prev=n,e.next=r,r.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function Kd(n,t,e,i){const r=Lu(n,t,e);return i?(r.next=i.next,r.prev=i,i.next.prev=r,i.next=r):(r.prev=r,r.next=r),r}function Go(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Lu(n,t,e){return{i:n,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function cb(n,t,e,i){let r=0;for(let s=t,o=e-i;s<e;s+=i)r+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return r}class lb{static triangulate(t,e,i=2){return qy(t,e,i)}}class To{static area(t){const e=t.length;let i=0;for(let r=e-1,s=0;s<e;r=s++)i+=t[r].x*t[s].y-t[s].x*t[r].y;return i*.5}static isClockWise(t){return To.area(t)<0}static triangulateShape(t,e){const i=[],r=[],s=[];Zd(t),Qd(i,t);let o=t.length;e.forEach(Zd);for(let c=0;c<e.length;c++)r.push(o),o+=e[c].length,Qd(i,e[c]);const a=lb.triangulate(i,r);for(let c=0;c<a.length;c+=3)s.push(a.slice(c,c+3));return s}}function Zd(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function Qd(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class an extends Ee{constructor(t=1,e=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:r};const s=t/2,o=e/2,a=Math.floor(i),c=Math.floor(r),l=a+1,u=c+1,h=t/a,d=e/c,f=[],g=[],_=[],m=[];for(let p=0;p<u;p++){const A=p*d-o;for(let S=0;S<l;S++){const w=S*h-s;g.push(w,-A,0),_.push(0,0,1),m.push(S/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let A=0;A<a;A++){const S=A+l*p,w=A+l*(p+1),I=A+1+l*(p+1),E=A+1+l*p;f.push(S,w,E),f.push(w,I,E)}this.setIndex(f),this.setAttribute("position",new Le(g,3)),this.setAttribute("normal",new Le(_,3)),this.setAttribute("uv",new Le(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new an(t.width,t.height,t.widthSegments,t.heightSegments)}}class Ko extends Ee{constructor(t=.5,e=1,i=32,r=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:r,thetaStart:s,thetaLength:o},i=Math.max(3,i),r=Math.max(1,r);const a=[],c=[],l=[],u=[];let h=t;const d=(e-t)/r,f=new T,g=new ft;for(let _=0;_<=r;_++){for(let m=0;m<=i;m++){const p=s+m/i*o;f.x=h*Math.cos(p),f.y=h*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),g.x=(f.x/e+1)/2,g.y=(f.y/e+1)/2,u.push(g.x,g.y)}h+=d}for(let _=0;_<r;_++){const m=_*(i+1);for(let p=0;p<i;p++){const A=p+m,S=A,w=A+i+1,I=A+i+2,E=A+1;a.push(S,w,E),a.push(w,I,E)}}this.setIndex(a),this.setAttribute("position",new Le(c,3)),this.setAttribute("normal",new Le(l,3)),this.setAttribute("uv",new Le(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ko(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Nc extends Ee{constructor(t=new _h([new ft(0,.5),new ft(-.5,-.5),new ft(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],r=[],s=[],o=[];let a=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let u=0;u<t.length;u++)l(t[u]),this.addGroup(a,c,u),a+=c,c=0;this.setIndex(i),this.setAttribute("position",new Le(r,3)),this.setAttribute("normal",new Le(s,3)),this.setAttribute("uv",new Le(o,2));function l(u){const h=r.length/3,d=u.extractPoints(e);let f=d.shape;const g=d.holes;To.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){const A=g[m];To.isClockWise(A)===!0&&(g[m]=A.reverse())}const _=To.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){const A=g[m];f=f.concat(A)}for(let m=0,p=f.length;m<p;m++){const A=f[m];r.push(A.x,A.y,0),s.push(0,0,1),o.push(A.x,A.y)}for(let m=0,p=_.length;m<p;m++){const A=_[m],S=A[0]+h,w=A[1]+h,I=A[2]+h;i.push(S,w,I),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return ub(e,t)}static fromJSON(t,e){const i=[];for(let r=0,s=t.shapes.length;r<s;r++){const o=e[t.shapes[r]];i.push(o)}return new Nc(i,t.curveSegments)}}function ub(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const r=n[e];t.shapes.push(r.uuid)}else t.shapes.push(n.uuid);return t}class Sr extends Ee{constructor(t=1,e=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const c=Math.min(o+a,Math.PI);let l=0;const u=[],h=new T,d=new T,f=[],g=[],_=[],m=[];for(let p=0;p<=i;p++){const A=[],S=p/i;let w=0;p===0&&o===0?w=.5/e:p===i&&c===Math.PI&&(w=-.5/e);for(let I=0;I<=e;I++){const E=I/e;h.x=-t*Math.cos(r+E*s)*Math.sin(o+S*a),h.y=t*Math.cos(o+S*a),h.z=t*Math.sin(r+E*s)*Math.sin(o+S*a),g.push(h.x,h.y,h.z),d.copy(h).normalize(),_.push(d.x,d.y,d.z),m.push(E+w,1-S),A.push(l++)}u.push(A)}for(let p=0;p<i;p++)for(let A=0;A<e;A++){const S=u[p][A+1],w=u[p][A],I=u[p+1][A],E=u[p+1][A+1];(p!==0||o>0)&&f.push(S,w,E),(p!==i-1||c<Math.PI)&&f.push(w,I,E)}this.setIndex(f),this.setAttribute("position",new Le(g,3)),this.setAttribute("normal",new Le(_,3)),this.setAttribute("uv",new Le(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Sr(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Ze extends Zs{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Zt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Zt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=J0,this.normalScale=new ft(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Pi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class hb extends Zs{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Cv,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class db extends Zs{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class ym extends Ke{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Zt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class fb extends ym{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ke.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Zt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Al=new De,tf=new T,ef=new T;class pb{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ft(512,512),this.mapType=Li,this.map=null,this.mapPass=null,this.matrix=new De,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new gh,this._frameExtents=new ft(1,1),this._viewportCount=1,this._viewports=[new Xe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;tf.setFromMatrixPosition(t.matrixWorld),e.position.copy(tf),ef.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(ef),e.updateMatrixWorld(),Al.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Al,e.coordinateSystem,e.reversedDepth),e.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Al)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class bm extends om{constructor(t=-1,e=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-t,o=i+t,a=r+e,c=r-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class mb extends pb{constructor(){super(new bm(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Sm extends ym{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ke.DEFAULT_UP),this.updateMatrix(),this.target=new Ke,this.shadow=new mb}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class gb extends Zn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class xb extends Dy{constructor(t=10,e=10,i=4473924,r=8947848){i=new Zt(i),r=new Zt(r);const s=e/2,o=t/e,a=t/2,c=[],l=[];for(let d=0,f=0,g=-a;d<=e;d++,g+=o){c.push(-a,0,g,a,0,g),c.push(g,0,-a,g,0,a);const _=d===s?i:r;_.toArray(l,f),f+=3,_.toArray(l,f),f+=3,_.toArray(l,f),f+=3,_.toArray(l,f),f+=3}const u=new Ee;u.setAttribute("position",new Le(c,3)),u.setAttribute("color",new Le(l,3));const h=new Pn({vertexColors:!0,toneMapped:!1});super(u,h),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}function nf(n,t,e,i){const r=_b(i);switch(e){case $0:return n*t;case ch:return n*t/r.components*r.byteLength;case lh:return n*t/r.components*r.byteLength;case uh:return n*t*2/r.components*r.byteLength;case hh:return n*t*2/r.components*r.byteLength;case j0:return n*t*3/r.components*r.byteLength;case hi:return n*t*4/r.components*r.byteLength;case dh:return n*t*4/r.components*r.byteLength;case za:case Va:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case ka:case Ha:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case ru:case ou:return Math.max(n,16)*Math.max(t,8)/4;case iu:case su:return Math.max(n,8)*Math.max(t,8)/2;case au:case cu:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case lu:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case uu:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case hu:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case du:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case fu:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case pu:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case mu:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case gu:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case xu:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case _u:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case vu:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case yu:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case bu:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Su:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Mu:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case wu:case Au:case Eu:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Tu:case Cu:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Ru:case Iu:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function _b(n){switch(n){case Li:case W0:return{byteLength:1,components:1};case Fo:case X0:case js:return{byteLength:2,components:1};case oh:case ah:return{byteLength:2,components:4};case Hr:case sh:case Ci:return{byteLength:4,components:1};case q0:case Y0:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:rh}}));typeof window<"u"&&(window.__THREE__?Gt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=rh);function Mm(){let n=null,t=!1,e=null,i=null;function r(s,o){e(s,o),i=n.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(r),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function vb(n){const t=new WeakMap;function e(a,c){const l=a.array,u=a.usage,h=l.byteLength,d=n.createBuffer();n.bindBuffer(c,d),n.bufferData(c,l,u),a.onUploadCallback();let f;if(l instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=n.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=n.SHORT;else if(l instanceof Uint32Array)f=n.UNSIGNED_INT;else if(l instanceof Int32Array)f=n.INT;else if(l instanceof Int8Array)f=n.BYTE;else if(l instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,c,l){const u=c.array,h=c.updateRanges;if(n.bindBuffer(l,a),h.length===0)n.bufferSubData(l,0,u);else{h.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<h.length;f++){const g=h[d],_=h[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,h[d]=_)}h.length=d+1;for(let f=0,g=h.length;f<g;f++){const _=h[f];n.bufferSubData(l,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(n.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,a,c),l.version=a.version}}return{get:r,remove:s,update:o}}var yb=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,bb=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Sb=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Mb=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,wb=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ab=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Eb=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Tb=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Cb=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Rb=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ib=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Db=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Lb=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Pb=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Ub=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Fb=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Nb=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Bb=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ob=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,zb=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Vb=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,kb=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Hb=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Gb=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Wb=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Xb=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,qb=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Yb=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,$b=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,jb=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Jb="gl_FragColor = linearToOutputTexel( gl_FragColor );",Kb=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Zb=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Qb=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,tS=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,eS=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,nS=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,iS=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,rS=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,sS=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,oS=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,aS=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,cS=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lS=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,uS=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,hS=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,dS=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,fS=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,pS=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,mS=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,gS=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,xS=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,_S=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 uv = vec2( roughness, dotNV );
	return texture2D( dfgLUT, uv ).rg;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = DFGApprox( vec3(0.0, 0.0, 1.0), vec3(sqrt(1.0 - dotNV * dotNV), 0.0, dotNV), material.roughness );
	vec2 dfgL = DFGApprox( vec3(0.0, 0.0, 1.0), vec3(sqrt(1.0 - dotNL * dotNL), 0.0, dotNL), material.roughness );
	vec3 FssEss_V = material.specularColor * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColor * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColor + ( 1.0 - material.specularColor ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,vS=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,yS=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,bS=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,SS=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,MS=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wS=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,AS=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ES=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,TS=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,CS=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,RS=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,IS=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,DS=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,LS=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,PS=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,US=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,FS=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,NS=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,BS=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,OS=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,zS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,VS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,kS=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,HS=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,GS=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,WS=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,XS=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,qS=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,YS=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,$S=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,jS=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,JS=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,KS=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ZS=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,QS=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,tM=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,eM=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,nM=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,iM=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,rM=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,sM=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,oM=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,aM=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,cM=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,lM=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,uM=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,hM=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,dM=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,fM=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,pM=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,mM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,gM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,xM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,_M=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const vM=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,yM=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,SM=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,MM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,wM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,AM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,EM=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,TM=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,CM=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,RM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,IM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,DM=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,LM=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,PM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,UM=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,FM=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,NM=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,BM=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,OM=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zM=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,VM=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,kM=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,HM=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,GM=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,WM=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,XM=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,qM=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,YM=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,$M=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,jM=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,JM=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,KM=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ZM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Kt={alphahash_fragment:yb,alphahash_pars_fragment:bb,alphamap_fragment:Sb,alphamap_pars_fragment:Mb,alphatest_fragment:wb,alphatest_pars_fragment:Ab,aomap_fragment:Eb,aomap_pars_fragment:Tb,batching_pars_vertex:Cb,batching_vertex:Rb,begin_vertex:Ib,beginnormal_vertex:Db,bsdfs:Lb,iridescence_fragment:Pb,bumpmap_pars_fragment:Ub,clipping_planes_fragment:Fb,clipping_planes_pars_fragment:Nb,clipping_planes_pars_vertex:Bb,clipping_planes_vertex:Ob,color_fragment:zb,color_pars_fragment:Vb,color_pars_vertex:kb,color_vertex:Hb,common:Gb,cube_uv_reflection_fragment:Wb,defaultnormal_vertex:Xb,displacementmap_pars_vertex:qb,displacementmap_vertex:Yb,emissivemap_fragment:$b,emissivemap_pars_fragment:jb,colorspace_fragment:Jb,colorspace_pars_fragment:Kb,envmap_fragment:Zb,envmap_common_pars_fragment:Qb,envmap_pars_fragment:tS,envmap_pars_vertex:eS,envmap_physical_pars_fragment:dS,envmap_vertex:nS,fog_vertex:iS,fog_pars_vertex:rS,fog_fragment:sS,fog_pars_fragment:oS,gradientmap_pars_fragment:aS,lightmap_pars_fragment:cS,lights_lambert_fragment:lS,lights_lambert_pars_fragment:uS,lights_pars_begin:hS,lights_toon_fragment:fS,lights_toon_pars_fragment:pS,lights_phong_fragment:mS,lights_phong_pars_fragment:gS,lights_physical_fragment:xS,lights_physical_pars_fragment:_S,lights_fragment_begin:vS,lights_fragment_maps:yS,lights_fragment_end:bS,logdepthbuf_fragment:SS,logdepthbuf_pars_fragment:MS,logdepthbuf_pars_vertex:wS,logdepthbuf_vertex:AS,map_fragment:ES,map_pars_fragment:TS,map_particle_fragment:CS,map_particle_pars_fragment:RS,metalnessmap_fragment:IS,metalnessmap_pars_fragment:DS,morphinstance_vertex:LS,morphcolor_vertex:PS,morphnormal_vertex:US,morphtarget_pars_vertex:FS,morphtarget_vertex:NS,normal_fragment_begin:BS,normal_fragment_maps:OS,normal_pars_fragment:zS,normal_pars_vertex:VS,normal_vertex:kS,normalmap_pars_fragment:HS,clearcoat_normal_fragment_begin:GS,clearcoat_normal_fragment_maps:WS,clearcoat_pars_fragment:XS,iridescence_pars_fragment:qS,opaque_fragment:YS,packing:$S,premultiplied_alpha_fragment:jS,project_vertex:JS,dithering_fragment:KS,dithering_pars_fragment:ZS,roughnessmap_fragment:QS,roughnessmap_pars_fragment:tM,shadowmap_pars_fragment:eM,shadowmap_pars_vertex:nM,shadowmap_vertex:iM,shadowmask_pars_fragment:rM,skinbase_vertex:sM,skinning_pars_vertex:oM,skinning_vertex:aM,skinnormal_vertex:cM,specularmap_fragment:lM,specularmap_pars_fragment:uM,tonemapping_fragment:hM,tonemapping_pars_fragment:dM,transmission_fragment:fM,transmission_pars_fragment:pM,uv_pars_fragment:mM,uv_pars_vertex:gM,uv_vertex:xM,worldpos_vertex:_M,background_vert:vM,background_frag:yM,backgroundCube_vert:bM,backgroundCube_frag:SM,cube_vert:MM,cube_frag:wM,depth_vert:AM,depth_frag:EM,distanceRGBA_vert:TM,distanceRGBA_frag:CM,equirect_vert:RM,equirect_frag:IM,linedashed_vert:DM,linedashed_frag:LM,meshbasic_vert:PM,meshbasic_frag:UM,meshlambert_vert:FM,meshlambert_frag:NM,meshmatcap_vert:BM,meshmatcap_frag:OM,meshnormal_vert:zM,meshnormal_frag:VM,meshphong_vert:kM,meshphong_frag:HM,meshphysical_vert:GM,meshphysical_frag:WM,meshtoon_vert:XM,meshtoon_frag:qM,points_vert:YM,points_frag:$M,shadow_vert:jM,shadow_frag:JM,sprite_vert:KM,sprite_frag:ZM},at={common:{diffuse:{value:new Zt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new jt}},envmap:{envMap:{value:null},envMapRotation:{value:new jt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new jt},normalScale:{value:new ft(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Zt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Zt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0},uvTransform:{value:new jt}},sprite:{diffuse:{value:new Zt(16777215)},opacity:{value:1},center:{value:new ft(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}}},Si={basic:{uniforms:vn([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.fog]),vertexShader:Kt.meshbasic_vert,fragmentShader:Kt.meshbasic_frag},lambert:{uniforms:vn([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.fog,at.lights,{emissive:{value:new Zt(0)}}]),vertexShader:Kt.meshlambert_vert,fragmentShader:Kt.meshlambert_frag},phong:{uniforms:vn([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.fog,at.lights,{emissive:{value:new Zt(0)},specular:{value:new Zt(1118481)},shininess:{value:30}}]),vertexShader:Kt.meshphong_vert,fragmentShader:Kt.meshphong_frag},standard:{uniforms:vn([at.common,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.roughnessmap,at.metalnessmap,at.fog,at.lights,{emissive:{value:new Zt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag},toon:{uniforms:vn([at.common,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.gradientmap,at.fog,at.lights,{emissive:{value:new Zt(0)}}]),vertexShader:Kt.meshtoon_vert,fragmentShader:Kt.meshtoon_frag},matcap:{uniforms:vn([at.common,at.bumpmap,at.normalmap,at.displacementmap,at.fog,{matcap:{value:null}}]),vertexShader:Kt.meshmatcap_vert,fragmentShader:Kt.meshmatcap_frag},points:{uniforms:vn([at.points,at.fog]),vertexShader:Kt.points_vert,fragmentShader:Kt.points_frag},dashed:{uniforms:vn([at.common,at.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Kt.linedashed_vert,fragmentShader:Kt.linedashed_frag},depth:{uniforms:vn([at.common,at.displacementmap]),vertexShader:Kt.depth_vert,fragmentShader:Kt.depth_frag},normal:{uniforms:vn([at.common,at.bumpmap,at.normalmap,at.displacementmap,{opacity:{value:1}}]),vertexShader:Kt.meshnormal_vert,fragmentShader:Kt.meshnormal_frag},sprite:{uniforms:vn([at.sprite,at.fog]),vertexShader:Kt.sprite_vert,fragmentShader:Kt.sprite_frag},background:{uniforms:{uvTransform:{value:new jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Kt.background_vert,fragmentShader:Kt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new jt}},vertexShader:Kt.backgroundCube_vert,fragmentShader:Kt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Kt.cube_vert,fragmentShader:Kt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Kt.equirect_vert,fragmentShader:Kt.equirect_frag},distanceRGBA:{uniforms:vn([at.common,at.displacementmap,{referencePosition:{value:new T},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Kt.distanceRGBA_vert,fragmentShader:Kt.distanceRGBA_frag},shadow:{uniforms:vn([at.lights,at.fog,{color:{value:new Zt(0)},opacity:{value:1}}]),vertexShader:Kt.shadow_vert,fragmentShader:Kt.shadow_frag}};Si.physical={uniforms:vn([Si.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new jt},clearcoatNormalScale:{value:new ft(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new jt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new jt},sheen:{value:0},sheenColor:{value:new Zt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new jt},transmissionSamplerSize:{value:new ft},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new jt},attenuationDistance:{value:0},attenuationColor:{value:new Zt(0)},specularColor:{value:new Zt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new jt},anisotropyVector:{value:new ft},anisotropyMap:{value:null},anisotropyMapTransform:{value:new jt}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag};const Ca={r:0,b:0,g:0},Dr=new Pi,QM=new De;function t1(n,t,e,i,r,s,o){const a=new Zt(0);let c=s===!0?0:1,l,u,h=null,d=0,f=null;function g(S){let w=S.isScene===!0?S.background:null;return w&&w.isTexture&&(w=(S.backgroundBlurriness>0?e:t).get(w)),w}function _(S){let w=!1;const I=g(S);I===null?p(a,c):I&&I.isColor&&(p(I,1),w=!0);const E=n.xr.getEnvironmentBlendMode();E==="additive"?i.buffers.color.setClear(0,0,0,1,o):E==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||w)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(S,w){const I=g(w);I&&(I.isCubeTexture||I.mapping===Uc)?(u===void 0&&(u=new mt(new cn(1,1,1),new er({name:"BackgroundCubeMaterial",uniforms:Gs(Si.backgroundCube.uniforms),vertexShader:Si.backgroundCube.vertexShader,fragmentShader:Si.backgroundCube.fragmentShader,side:Mn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(E,D,O){this.matrixWorld.copyPosition(O.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),Dr.copy(w.backgroundRotation),Dr.x*=-1,Dr.y*=-1,Dr.z*=-1,I.isCubeTexture&&I.isRenderTargetTexture===!1&&(Dr.y*=-1,Dr.z*=-1),u.material.uniforms.envMap.value=I,u.material.uniforms.flipEnvMap.value=I.isCubeTexture&&I.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(QM.makeRotationFromEuler(Dr)),u.material.toneMapped=ue.getTransfer(I.colorSpace)!==Se,(h!==I||d!==I.version||f!==n.toneMapping)&&(u.material.needsUpdate=!0,h=I,d=I.version,f=n.toneMapping),u.layers.enableAll(),S.unshift(u,u.geometry,u.material,0,0,null)):I&&I.isTexture&&(l===void 0&&(l=new mt(new an(2,2),new er({name:"BackgroundMaterial",uniforms:Gs(Si.background.uniforms),vertexShader:Si.background.vertexShader,fragmentShader:Si.background.fragmentShader,side:br,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=I,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=ue.getTransfer(I.colorSpace)!==Se,I.matrixAutoUpdate===!0&&I.updateMatrix(),l.material.uniforms.uvTransform.value.copy(I.matrix),(h!==I||d!==I.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,h=I,d=I.version,f=n.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function p(S,w){S.getRGB(Ca,sm(n)),i.buffers.color.setClear(Ca.r,Ca.g,Ca.b,w,o)}function A(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,w=1){a.set(S),c=w,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(S){c=S,p(a,c)},render:_,addToRenderList:m,dispose:A}}function e1(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=d(null);let s=r,o=!1;function a(y,L,B,k,X){let W=!1;const $=h(k,B,L);s!==$&&(s=$,l(s.object)),W=f(y,k,B,X),W&&g(y,k,B,X),X!==null&&t.update(X,n.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,w(y,L,B,k),X!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(X).buffer))}function c(){return n.createVertexArray()}function l(y){return n.bindVertexArray(y)}function u(y){return n.deleteVertexArray(y)}function h(y,L,B){const k=B.wireframe===!0;let X=i[y.id];X===void 0&&(X={},i[y.id]=X);let W=X[L.id];W===void 0&&(W={},X[L.id]=W);let $=W[k];return $===void 0&&($=d(c()),W[k]=$),$}function d(y){const L=[],B=[],k=[];for(let X=0;X<e;X++)L[X]=0,B[X]=0,k[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:B,attributeDivisors:k,object:y,attributes:{},index:null}}function f(y,L,B,k){const X=s.attributes,W=L.attributes;let $=0;const Q=B.getAttributes();for(const G in Q)if(Q[G].location>=0){const ot=X[G];let Rt=W[G];if(Rt===void 0&&(G==="instanceMatrix"&&y.instanceMatrix&&(Rt=y.instanceMatrix),G==="instanceColor"&&y.instanceColor&&(Rt=y.instanceColor)),ot===void 0||ot.attribute!==Rt||Rt&&ot.data!==Rt.data)return!0;$++}return s.attributesNum!==$||s.index!==k}function g(y,L,B,k){const X={},W=L.attributes;let $=0;const Q=B.getAttributes();for(const G in Q)if(Q[G].location>=0){let ot=W[G];ot===void 0&&(G==="instanceMatrix"&&y.instanceMatrix&&(ot=y.instanceMatrix),G==="instanceColor"&&y.instanceColor&&(ot=y.instanceColor));const Rt={};Rt.attribute=ot,ot&&ot.data&&(Rt.data=ot.data),X[G]=Rt,$++}s.attributes=X,s.attributesNum=$,s.index=k}function _(){const y=s.newAttributes;for(let L=0,B=y.length;L<B;L++)y[L]=0}function m(y){p(y,0)}function p(y,L){const B=s.newAttributes,k=s.enabledAttributes,X=s.attributeDivisors;B[y]=1,k[y]===0&&(n.enableVertexAttribArray(y),k[y]=1),X[y]!==L&&(n.vertexAttribDivisor(y,L),X[y]=L)}function A(){const y=s.newAttributes,L=s.enabledAttributes;for(let B=0,k=L.length;B<k;B++)L[B]!==y[B]&&(n.disableVertexAttribArray(B),L[B]=0)}function S(y,L,B,k,X,W,$){$===!0?n.vertexAttribIPointer(y,L,B,X,W):n.vertexAttribPointer(y,L,B,k,X,W)}function w(y,L,B,k){_();const X=k.attributes,W=B.getAttributes(),$=L.defaultAttributeValues;for(const Q in W){const G=W[Q];if(G.location>=0){let it=X[Q];if(it===void 0&&(Q==="instanceMatrix"&&y.instanceMatrix&&(it=y.instanceMatrix),Q==="instanceColor"&&y.instanceColor&&(it=y.instanceColor)),it!==void 0){const ot=it.normalized,Rt=it.itemSize,ae=t.get(it);if(ae===void 0)continue;const ve=ae.buffer,Te=ae.type,Ce=ae.bytesPerElement,Y=Te===n.INT||Te===n.UNSIGNED_INT||it.gpuType===sh;if(it.isInterleavedBufferAttribute){const K=it.data,pt=K.stride,Yt=it.offset;if(K.isInstancedInterleavedBuffer){for(let St=0;St<G.locationSize;St++)p(G.location+St,K.meshPerAttribute);y.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let St=0;St<G.locationSize;St++)m(G.location+St);n.bindBuffer(n.ARRAY_BUFFER,ve);for(let St=0;St<G.locationSize;St++)S(G.location+St,Rt/G.locationSize,Te,ot,pt*Ce,(Yt+Rt/G.locationSize*St)*Ce,Y)}else{if(it.isInstancedBufferAttribute){for(let K=0;K<G.locationSize;K++)p(G.location+K,it.meshPerAttribute);y.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=it.meshPerAttribute*it.count)}else for(let K=0;K<G.locationSize;K++)m(G.location+K);n.bindBuffer(n.ARRAY_BUFFER,ve);for(let K=0;K<G.locationSize;K++)S(G.location+K,Rt/G.locationSize,Te,ot,Rt*Ce,Rt/G.locationSize*K*Ce,Y)}}else if($!==void 0){const ot=$[Q];if(ot!==void 0)switch(ot.length){case 2:n.vertexAttrib2fv(G.location,ot);break;case 3:n.vertexAttrib3fv(G.location,ot);break;case 4:n.vertexAttrib4fv(G.location,ot);break;default:n.vertexAttrib1fv(G.location,ot)}}}}A()}function I(){O();for(const y in i){const L=i[y];for(const B in L){const k=L[B];for(const X in k)u(k[X].object),delete k[X];delete L[B]}delete i[y]}}function E(y){if(i[y.id]===void 0)return;const L=i[y.id];for(const B in L){const k=L[B];for(const X in k)u(k[X].object),delete k[X];delete L[B]}delete i[y.id]}function D(y){for(const L in i){const B=i[L];if(B[y.id]===void 0)continue;const k=B[y.id];for(const X in k)u(k[X].object),delete k[X];delete B[y.id]}}function O(){b(),o=!0,s!==r&&(s=r,l(s.object))}function b(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:O,resetDefaultState:b,dispose:I,releaseStatesOfGeometry:E,releaseStatesOfProgram:D,initAttributes:_,enableAttribute:m,disableUnusedAttributes:A}}function n1(n,t,e){let i;function r(l){i=l}function s(l,u){n.drawArrays(i,l,u),e.update(u,i,1)}function o(l,u,h){h!==0&&(n.drawArraysInstanced(i,l,u,h),e.update(u,i,h))}function a(l,u,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,u,0,h);let f=0;for(let g=0;g<h;g++)f+=u[g];e.update(f,i,1)}function c(l,u,h,d){if(h===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)o(l[g],u[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(i,l,0,u,0,d,0,h);let g=0;for(let _=0;_<h;_++)g+=u[_]*d[_];e.update(g,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function i1(n,t,e,i){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const D=t.get("EXT_texture_filter_anisotropic");r=n.getParameter(D.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(D){return!(D!==hi&&i.convert(D)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(D){const O=D===js&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(D!==Li&&i.convert(D)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&D!==Ci&&!O)}function c(D){if(D==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";D="mediump"}return D==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const u=c(l);u!==l&&(Gt("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const h=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),A=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),S=n.getParameter(n.MAX_VARYING_VECTORS),w=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),I=g>0,E=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:A,maxVaryings:S,maxFragmentUniforms:w,vertexTextures:I,maxSamples:E}}function r1(n){const t=this;let e=null,i=0,r=!1,s=!1;const o=new Ur,a=new jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||i!==0||r;return r=d,i=h.length,f},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){e=u(h,d,0)},this.setState=function(h,d,f){const g=h.clippingPlanes,_=h.clipIntersection,m=h.clipShadows,p=n.get(h);if(!r||g===null||g.length===0||s&&!m)s?u(null):l();else{const A=s?0:i,S=A*4;let w=p.clippingState||null;c.value=w,w=u(g,d,S,f);for(let I=0;I!==S;++I)w[I]=e[I];p.clippingState=w,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=A}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function u(h,d,f,g){const _=h!==null?h.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=f+_*4,A=d.matrixWorldInverse;a.getNormalMatrix(A),(m===null||m.length<p)&&(m=new Float32Array(p));for(let S=0,w=f;S!==_;++S,w+=4)o.copy(h[S]).applyMatrix4(A,a),o.normal.toArray(m,w),m[w+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function s1(n){let t=new WeakMap;function e(o,a){return a===Ql?o.mapping=Vs:a===tu&&(o.mapping=ks),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===Ql||a===tu)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new wy(c.height);return l.fromEquirectangularTexture(n,o),t.set(o,l),o.addEventListener("dispose",r),e(l.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}const gr=4,rf=[.125,.215,.35,.446,.526,.582],Nr=20,o1=256,uo=new bm,sf=new Zt;let El=null,Tl=0,Cl=0,Rl=!1;const a1=new T;class of{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,i=.1,r=100,s={}){const{size:o=256,position:a=a1}=s;El=this._renderer.getRenderTarget(),Tl=this._renderer.getActiveCubeFace(),Cl=this._renderer.getActiveMipmapLevel(),Rl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,i,r,c,a),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=lf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=cf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(El,Tl,Cl),this._renderer.xr.enabled=Rl,t.scissorTest=!1,hs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Vs||t.mapping===ks?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),El=this._renderer.getRenderTarget(),Tl=this._renderer.getActiveCubeFace(),Cl=this._renderer.getActiveMipmapLevel(),Rl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Qn,minFilter:Qn,generateMipmaps:!1,type:js,format:hi,colorSpace:Hs,depthBuffer:!1},r=af(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=af(t,e,i);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=c1(s)),this._blurMaterial=u1(s,t,e),this._ggxMaterial=l1(s,t,e)}return r}_compileMaterial(t){const e=new mt(new Ee,t);this._renderer.compile(e,uo)}_sceneToCubeUV(t,e,i,r,s){const c=new Zn(90,1,e,i),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(sf),h.toneMapping=xr,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(r),h.clearDepth(),h.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new mt(new cn,new de({name:"PMREM.Background",side:Mn,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,m=_.material;let p=!1;const A=t.background;A?A.isColor&&(m.color.copy(A),t.background=null,p=!0):(m.color.copy(sf),p=!0);for(let S=0;S<6;S++){const w=S%3;w===0?(c.up.set(0,l[S],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+u[S],s.y,s.z)):w===1?(c.up.set(0,0,l[S]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+u[S],s.z)):(c.up.set(0,l[S],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+u[S]));const I=this._cubeSize;hs(r,w*I,S>2?I:0,I,I),h.setRenderTarget(r),p&&h.render(_,c),h.render(t,c)}h.toneMapping=f,h.autoClear=d,t.background=A}_textureToCubeUV(t,e){const i=this._renderer,r=t.mapping===Vs||t.mapping===ks;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=lf()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=cf());const s=r?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;const a=s.uniforms;a.envMap.value=t;const c=this._cubeSize;hs(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(o,uo)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(t,s-1,s);e.autoClear=i}_applyGGXFilter(t,e,i){const r=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;const c=o.uniforms,l=i/(this._lodMeshes.length-1),u=e/(this._lodMeshes.length-1),h=Math.sqrt(l*l-u*u),d=.05+l*.95,f=h*d,{_lodMax:g}=this,_=this._sizeLods[i],m=3*_*(i>g-gr?i-g+gr:0),p=4*(this._cubeSize-_);c.envMap.value=t.texture,c.roughness.value=f,c.mipInt.value=g-e,hs(s,m,p,3*_,2*_),r.setRenderTarget(s),r.render(a,uo),c.envMap.value=s.texture,c.roughness.value=0,c.mipInt.value=g-i,hs(t,m,p,3*_,2*_),r.setRenderTarget(t),r.render(a,uo)}_blur(t,e,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,r,"latitudinal",s),this._halfBlur(o,t,i,i,r,"longitudinal",s)}_halfBlur(t,e,i,r,s,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&qe("blur direction must be either latitudinal or longitudinal!");const u=3,h=this._lodMeshes[r];h.material=l;const d=l.uniforms,f=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*Nr-1),_=s/g,m=isFinite(s)?1+Math.floor(u*_):Nr;m>Nr&&Gt(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Nr}`);const p=[];let A=0;for(let D=0;D<Nr;++D){const O=D/_,b=Math.exp(-O*O/2);p.push(b),D===0?A+=b:D<m&&(A+=2*b)}for(let D=0;D<p.length;D++)p[D]=p[D]/A;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:S}=this;d.dTheta.value=g,d.mipInt.value=S-i;const w=this._sizeLods[r],I=3*w*(r>S-gr?r-S+gr:0),E=4*(this._cubeSize-w);hs(e,I,E,3*w,2*w),c.setRenderTarget(e),c.render(h,uo)}}function c1(n){const t=[],e=[],i=[];let r=n;const s=n-gr+1+rf.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);t.push(a);let c=1/a;o>n-gr?c=rf[o-n+gr-1]:o===0&&(c=0),e.push(c);const l=1/(a-2),u=-l,h=1+l,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,g=6,_=3,m=2,p=1,A=new Float32Array(_*g*f),S=new Float32Array(m*g*f),w=new Float32Array(p*g*f);for(let E=0;E<f;E++){const D=E%3*2/3-1,O=E>2?0:-1,b=[D,O,0,D+2/3,O,0,D+2/3,O+1,0,D,O,0,D+2/3,O+1,0,D,O+1,0];A.set(b,_*g*E),S.set(d,m*g*E);const y=[E,E,E,E,E,E];w.set(y,p*g*E)}const I=new Ee;I.setAttribute("position",new wn(A,_)),I.setAttribute("uv",new wn(S,m)),I.setAttribute("faceIndex",new wn(w,p)),i.push(new mt(I,null)),r>gr&&r--}return{lodMeshes:i,sizeLods:t,sigmas:e}}function af(n,t,e){const i=new Gr(n,t,e);return i.texture.mapping=Uc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function hs(n,t,e,i,r){n.viewport.set(t,e,i,r),n.scissor.set(t,e,i,r)}function l1(n,t,e){return new er({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:o1,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Bc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 3.2: Transform view direction to hemisphere configuration
				vec3 Vh = normalize(vec3(alpha * V.x, alpha * V.y, V.z));

				// Section 4.1: Orthonormal basis
				float lensq = Vh.x * Vh.x + Vh.y * Vh.y;
				vec3 T1 = lensq > 0.0 ? vec3(-Vh.y, Vh.x, 0.0) / sqrt(lensq) : vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(Vh, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + Vh.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * Vh;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Zi,depthTest:!1,depthWrite:!1})}function u1(n,t,e){const i=new Float32Array(Nr),r=new T(0,1,0);return new er({name:"SphericalGaussianBlur",defines:{n:Nr,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Bc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Zi,depthTest:!1,depthWrite:!1})}function cf(){return new er({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Bc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Zi,depthTest:!1,depthWrite:!1})}function lf(){return new er({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Bc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Zi,depthTest:!1,depthWrite:!1})}function Bc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function h1(n){let t=new WeakMap,e=null;function i(a){if(a&&a.isTexture){const c=a.mapping,l=c===Ql||c===tu,u=c===Vs||c===ks;if(l||u){let h=t.get(a);const d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new of(n)),h=l?e.fromEquirectangular(a,h):e.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),h.texture;if(h!==void 0)return h.texture;{const f=a.image;return l&&f&&f.height>0||u&&f&&r(f)?(e===null&&(e=new of(n)),h=l?e.fromEquirectangular(a):e.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function r(a){let c=0;const l=6;for(let u=0;u<l;u++)a[u]!==void 0&&c++;return c===l}function s(a){const c=a.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function d1(n){const t={};function e(i){if(t[i]!==void 0)return t[i];const r=n.getExtension(i);return t[i]=r,r}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const r=e(i);return r===null&&zo("WebGLRenderer: "+i+" extension not supported."),r}}}function f1(n,t,e,i){const r={},s=new WeakMap;function o(h){const d=h.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete r[d.id];const f=s.get(d);f&&(t.remove(f),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(h,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,e.memory.geometries++),d}function c(h){const d=h.attributes;for(const f in d)t.update(d[f],n.ARRAY_BUFFER)}function l(h){const d=[],f=h.index,g=h.attributes.position;let _=0;if(f!==null){const A=f.array;_=f.version;for(let S=0,w=A.length;S<w;S+=3){const I=A[S+0],E=A[S+1],D=A[S+2];d.push(I,E,E,D,D,I)}}else if(g!==void 0){const A=g.array;_=g.version;for(let S=0,w=A.length/3-1;S<w;S+=3){const I=S+0,E=S+1,D=S+2;d.push(I,E,E,D,D,I)}}else return;const m=new(Z0(d)?rm:im)(d,1);m.version=_;const p=s.get(h);p&&t.remove(p),s.set(h,m)}function u(h){const d=s.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&l(h)}else l(h);return s.get(h)}return{get:a,update:c,getWireframeAttribute:u}}function p1(n,t,e){let i;function r(d){i=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function c(d,f){n.drawElements(i,f,s,d*o),e.update(f,i,1)}function l(d,f,g){g!==0&&(n.drawElementsInstanced(i,f,s,d*o,g),e.update(f,i,g))}function u(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,i,1)}function h(d,f,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)l(d[p]/o,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(i,f,0,s,d,0,_,0,g);let p=0;for(let A=0;A<g;A++)p+=f[A]*_[A];e.update(p,i,1)}}this.setMode=r,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function m1(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=a*(s/3);break;case n.LINES:e.lines+=a*(s/2);break;case n.LINE_STRIP:e.lines+=a*(s-1);break;case n.LINE_LOOP:e.lines+=a*s;break;case n.POINTS:e.points+=a*s;break;default:qe("WebGLInfo: Unknown draw mode:",o);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:i}}function g1(n,t,e){const i=new WeakMap,r=new Xe;function s(o,a,c){const l=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let d=i.get(a);if(d===void 0||d.count!==h){let y=function(){O.dispose(),i.delete(a),a.removeEventListener("dispose",y)};var f=y;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],A=a.morphAttributes.normal||[],S=a.morphAttributes.color||[];let w=0;g===!0&&(w=1),_===!0&&(w=2),m===!0&&(w=3);let I=a.attributes.position.count*w,E=1;I>t.maxTextureSize&&(E=Math.ceil(I/t.maxTextureSize),I=t.maxTextureSize);const D=new Float32Array(I*E*4*h),O=new Q0(D,I,E,h);O.type=Ci,O.needsUpdate=!0;const b=w*4;for(let L=0;L<h;L++){const B=p[L],k=A[L],X=S[L],W=I*E*4*L;for(let $=0;$<B.count;$++){const Q=$*b;g===!0&&(r.fromBufferAttribute(B,$),D[W+Q+0]=r.x,D[W+Q+1]=r.y,D[W+Q+2]=r.z,D[W+Q+3]=0),_===!0&&(r.fromBufferAttribute(k,$),D[W+Q+4]=r.x,D[W+Q+5]=r.y,D[W+Q+6]=r.z,D[W+Q+7]=0),m===!0&&(r.fromBufferAttribute(X,$),D[W+Q+8]=r.x,D[W+Q+9]=r.y,D[W+Q+10]=r.z,D[W+Q+11]=X.itemSize===4?r.w:1)}}d={count:h,texture:O,size:new ft(I,E)},i.set(a,d),a.addEventListener("dispose",y)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const _=a.morphTargetsRelative?1:1-g;c.getUniforms().setValue(n,"morphTargetBaseInfluence",_),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function x1(n,t,e,i){let r=new WeakMap;function s(c){const l=i.render.frame,u=c.geometry,h=t.get(c,u);if(r.get(h)!==l&&(t.update(h),r.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),r.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==l&&(d.update(),r.set(d,l))}return h}function o(){r=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:o}}const wm=new gn,uf=new um(1,1),Am=new Q0,Em=new ay,Tm=new am,hf=[],df=[],ff=new Float32Array(16),pf=new Float32Array(9),mf=new Float32Array(4);function to(n,t,e){const i=n[0];if(i<=0||i>0)return n;const r=t*e;let s=hf[r];if(s===void 0&&(s=new Float32Array(r),hf[r]=s),t!==0){i.toArray(s,0);for(let o=1,a=0;o!==t;++o)a+=e,n[o].toArray(s,a)}return s}function Qe(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function tn(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Oc(n,t){let e=df[t];e===void 0&&(e=new Int32Array(t),df[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function _1(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function v1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Qe(e,t))return;n.uniform2fv(this.addr,t),tn(e,t)}}function y1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Qe(e,t))return;n.uniform3fv(this.addr,t),tn(e,t)}}function b1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Qe(e,t))return;n.uniform4fv(this.addr,t),tn(e,t)}}function S1(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Qe(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),tn(e,t)}else{if(Qe(e,i))return;mf.set(i),n.uniformMatrix2fv(this.addr,!1,mf),tn(e,i)}}function M1(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Qe(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),tn(e,t)}else{if(Qe(e,i))return;pf.set(i),n.uniformMatrix3fv(this.addr,!1,pf),tn(e,i)}}function w1(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Qe(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),tn(e,t)}else{if(Qe(e,i))return;ff.set(i),n.uniformMatrix4fv(this.addr,!1,ff),tn(e,i)}}function A1(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function E1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Qe(e,t))return;n.uniform2iv(this.addr,t),tn(e,t)}}function T1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Qe(e,t))return;n.uniform3iv(this.addr,t),tn(e,t)}}function C1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Qe(e,t))return;n.uniform4iv(this.addr,t),tn(e,t)}}function R1(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function I1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Qe(e,t))return;n.uniform2uiv(this.addr,t),tn(e,t)}}function D1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Qe(e,t))return;n.uniform3uiv(this.addr,t),tn(e,t)}}function L1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Qe(e,t))return;n.uniform4uiv(this.addr,t),tn(e,t)}}function P1(n,t,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(uf.compareFunction=K0,s=uf):s=wm,e.setTexture2D(t||s,r)}function U1(n,t,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),e.setTexture3D(t||Em,r)}function F1(n,t,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),e.setTextureCube(t||Tm,r)}function N1(n,t,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),e.setTexture2DArray(t||Am,r)}function B1(n){switch(n){case 5126:return _1;case 35664:return v1;case 35665:return y1;case 35666:return b1;case 35674:return S1;case 35675:return M1;case 35676:return w1;case 5124:case 35670:return A1;case 35667:case 35671:return E1;case 35668:case 35672:return T1;case 35669:case 35673:return C1;case 5125:return R1;case 36294:return I1;case 36295:return D1;case 36296:return L1;case 35678:case 36198:case 36298:case 36306:case 35682:return P1;case 35679:case 36299:case 36307:return U1;case 35680:case 36300:case 36308:case 36293:return F1;case 36289:case 36303:case 36311:case 36292:return N1}}function O1(n,t){n.uniform1fv(this.addr,t)}function z1(n,t){const e=to(t,this.size,2);n.uniform2fv(this.addr,e)}function V1(n,t){const e=to(t,this.size,3);n.uniform3fv(this.addr,e)}function k1(n,t){const e=to(t,this.size,4);n.uniform4fv(this.addr,e)}function H1(n,t){const e=to(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function G1(n,t){const e=to(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function W1(n,t){const e=to(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function X1(n,t){n.uniform1iv(this.addr,t)}function q1(n,t){n.uniform2iv(this.addr,t)}function Y1(n,t){n.uniform3iv(this.addr,t)}function $1(n,t){n.uniform4iv(this.addr,t)}function j1(n,t){n.uniform1uiv(this.addr,t)}function J1(n,t){n.uniform2uiv(this.addr,t)}function K1(n,t){n.uniform3uiv(this.addr,t)}function Z1(n,t){n.uniform4uiv(this.addr,t)}function Q1(n,t,e){const i=this.cache,r=t.length,s=Oc(e,r);Qe(i,s)||(n.uniform1iv(this.addr,s),tn(i,s));for(let o=0;o!==r;++o)e.setTexture2D(t[o]||wm,s[o])}function tw(n,t,e){const i=this.cache,r=t.length,s=Oc(e,r);Qe(i,s)||(n.uniform1iv(this.addr,s),tn(i,s));for(let o=0;o!==r;++o)e.setTexture3D(t[o]||Em,s[o])}function ew(n,t,e){const i=this.cache,r=t.length,s=Oc(e,r);Qe(i,s)||(n.uniform1iv(this.addr,s),tn(i,s));for(let o=0;o!==r;++o)e.setTextureCube(t[o]||Tm,s[o])}function nw(n,t,e){const i=this.cache,r=t.length,s=Oc(e,r);Qe(i,s)||(n.uniform1iv(this.addr,s),tn(i,s));for(let o=0;o!==r;++o)e.setTexture2DArray(t[o]||Am,s[o])}function iw(n){switch(n){case 5126:return O1;case 35664:return z1;case 35665:return V1;case 35666:return k1;case 35674:return H1;case 35675:return G1;case 35676:return W1;case 5124:case 35670:return X1;case 35667:case 35671:return q1;case 35668:case 35672:return Y1;case 35669:case 35673:return $1;case 5125:return j1;case 36294:return J1;case 36295:return K1;case 36296:return Z1;case 35678:case 36198:case 36298:case 36306:case 35682:return Q1;case 35679:case 36299:case 36307:return tw;case 35680:case 36300:case 36308:case 36293:return ew;case 36289:case 36303:case 36311:case 36292:return nw}}class rw{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=B1(e.type)}}class sw{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=iw(e.type)}}class ow{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(t,e[a.id],i)}}}const Il=/(\w+)(\])?(\[|\.)?/g;function gf(n,t){n.seq.push(t),n.map[t.id]=t}function aw(n,t,e){const i=n.name,r=i.length;for(Il.lastIndex=0;;){const s=Il.exec(i),o=Il.lastIndex;let a=s[1];const c=s[2]==="]",l=s[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===r){gf(e,l===void 0?new rw(a,n,t):new sw(a,n,t));break}else{let h=e.map[a];h===void 0&&(h=new ow(a),gf(e,h)),e=h}}}class Ga{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=t.getActiveUniform(e,r),o=t.getUniformLocation(e,s.name);aw(s,o,this)}}setValue(t,e,i,r){const s=this.map[e];s!==void 0&&s.setValue(t,i,r)}setOptional(t,e,i){const r=e[i];r!==void 0&&this.setValue(t,i,r)}static upload(t,e,i,r){for(let s=0,o=e.length;s!==o;++s){const a=e[s],c=i[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,r)}}static seqWithValue(t,e){const i=[];for(let r=0,s=t.length;r!==s;++r){const o=t[r];o.id in e&&i.push(o)}return i}}function xf(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const cw=37297;let lw=0;function uw(n,t){const e=n.split(`
`),i=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return i.join(`
`)}const _f=new jt;function hw(n){ue._getMatrix(_f,ue.workingColorSpace,n);const t=`mat3( ${_f.elements.map(e=>e.toFixed(4))} )`;switch(ue.getTransfer(n)){case bc:return[t,"LinearTransferOETF"];case Se:return[t,"sRGBTransferOETF"];default:return Gt("WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function vf(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),s=(n.getShaderInfoLog(t)||"").trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+s+`

`+uw(n.getShaderSource(t),a)}else return s}function dw(n,t){const e=hw(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function fw(n,t){let e;switch(t){case yv:e="Linear";break;case bv:e="Reinhard";break;case Sv:e="Cineon";break;case Mv:e="ACESFilmic";break;case Av:e="AgX";break;case Ev:e="Neutral";break;case wv:e="Custom";break;default:Gt("WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ra=new T;function pw(){ue.getLuminanceCoefficients(Ra);const n=Ra.x.toFixed(4),t=Ra.y.toFixed(4),e=Ra.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function mw(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(bo).join(`
`)}function gw(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function xw(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(t,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),e[o]={type:s.type,location:n.getAttribLocation(t,o),locationSize:a}}return e}function bo(n){return n!==""}function yf(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function bf(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const _w=/^[ \t]*#include +<([\w\d./]+)>/gm;function Pu(n){return n.replace(_w,yw)}const vw=new Map;function yw(n,t){let e=Kt[t];if(e===void 0){const i=vw.get(t);if(i!==void 0)e=Kt[i],Gt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Pu(e)}const bw=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Sf(n){return n.replace(bw,Sw)}function Sw(n,t,e,i){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Mf(n){let t=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Mw(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===k0?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Q_?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Hi&&(t="SHADOWMAP_TYPE_VSM"),t}function ww(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Vs:case ks:t="ENVMAP_TYPE_CUBE";break;case Uc:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Aw(n){let t="ENVMAP_MODE_REFLECTION";return n.envMap&&n.envMapMode===ks&&(t="ENVMAP_MODE_REFRACTION"),t}function Ew(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case H0:t="ENVMAP_BLENDING_MULTIPLY";break;case _v:t="ENVMAP_BLENDING_MIX";break;case vv:t="ENVMAP_BLENDING_ADD";break}return t}function Tw(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function Cw(n,t,e,i){const r=n.getContext(),s=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=Mw(e),l=ww(e),u=Aw(e),h=Ew(e),d=Tw(e),f=mw(e),g=gw(s),_=r.createProgram();let m,p,A=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(bo).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(bo).join(`
`),p.length>0&&(p+=`
`)):(m=[Mf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(bo).join(`
`),p=[Mf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==xr?"#define TONE_MAPPING":"",e.toneMapping!==xr?Kt.tonemapping_pars_fragment:"",e.toneMapping!==xr?fw("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Kt.colorspace_pars_fragment,dw("linearToOutputTexel",e.outputColorSpace),pw(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(bo).join(`
`)),o=Pu(o),o=yf(o,e),o=bf(o,e),a=Pu(a),a=yf(a,e),a=bf(a,e),o=Sf(o),a=Sf(a),e.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===yd?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===yd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const S=A+m+o,w=A+p+a,I=xf(r,r.VERTEX_SHADER,S),E=xf(r,r.FRAGMENT_SHADER,w);r.attachShader(_,I),r.attachShader(_,E),e.index0AttributeName!==void 0?r.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function D(L){if(n.debug.checkShaderErrors){const B=r.getProgramInfoLog(_)||"",k=r.getShaderInfoLog(I)||"",X=r.getShaderInfoLog(E)||"",W=B.trim(),$=k.trim(),Q=X.trim();let G=!0,it=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(G=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,_,I,E);else{const ot=vf(r,I,"vertex"),Rt=vf(r,E,"fragment");qe("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+W+`
`+ot+`
`+Rt)}else W!==""?Gt("WebGLProgram: Program Info Log:",W):($===""||Q==="")&&(it=!1);it&&(L.diagnostics={runnable:G,programLog:W,vertexShader:{log:$,prefix:m},fragmentShader:{log:Q,prefix:p}})}r.deleteShader(I),r.deleteShader(E),O=new Ga(r,_),b=xw(r,_)}let O;this.getUniforms=function(){return O===void 0&&D(this),O};let b;this.getAttributes=function(){return b===void 0&&D(this),b};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=r.getProgramParameter(_,cw)),y},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=lw++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=I,this.fragmentShader=E,this}let Rw=0;class Iw{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new Dw(t),e.set(t,i)),i}}class Dw{constructor(t){this.id=Rw++,this.code=t,this.usedTimes=0}}function Lw(n,t,e,i,r,s,o){const a=new em,c=new Iw,l=new Set,u=[],h=r.logarithmicDepthBuffer,d=r.vertexTextures;let f=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return l.add(b),b===0?"uv":`uv${b}`}function m(b,y,L,B,k){const X=B.fog,W=k.geometry,$=b.isMeshStandardMaterial?B.environment:null,Q=(b.isMeshStandardMaterial?e:t).get(b.envMap||$),G=Q&&Q.mapping===Uc?Q.image.height:null,it=g[b.type];b.precision!==null&&(f=r.getMaxPrecision(b.precision),f!==b.precision&&Gt("WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));const ot=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Rt=ot!==void 0?ot.length:0;let ae=0;W.morphAttributes.position!==void 0&&(ae=1),W.morphAttributes.normal!==void 0&&(ae=2),W.morphAttributes.color!==void 0&&(ae=3);let ve,Te,Ce,Y;if(it){const ye=Si[it];ve=ye.vertexShader,Te=ye.fragmentShader}else ve=b.vertexShader,Te=b.fragmentShader,c.update(b),Ce=c.getVertexShaderID(b),Y=c.getFragmentShaderID(b);const K=n.getRenderTarget(),pt=n.state.buffers.depth.getReversed(),Yt=k.isInstancedMesh===!0,St=k.isBatchedMesh===!0,ie=!!b.map,nn=!!b.matcap,ne=!!Q,Fe=!!b.aoMap,C=!!b.lightMap,re=!!b.bumpMap,se=!!b.normalMap,Re=!!b.displacementMap,_t=!!b.emissiveMap,Oe=!!b.metalnessMap,wt=!!b.roughnessMap,qt=b.anisotropy>0,M=b.clearcoat>0,x=b.dispersion>0,N=b.iridescence>0,q=b.sheen>0,J=b.transmission>0,H=qt&&!!b.anisotropyMap,bt=M&&!!b.clearcoatMap,ct=M&&!!b.clearcoatNormalMap,It=M&&!!b.clearcoatRoughnessMap,vt=N&&!!b.iridescenceMap,Z=N&&!!b.iridescenceThicknessMap,nt=q&&!!b.sheenColorMap,zt=q&&!!b.sheenRoughnessMap,Ft=!!b.specularMap,ht=!!b.specularColorMap,Ht=!!b.specularIntensityMap,R=J&&!!b.transmissionMap,lt=J&&!!b.thicknessMap,rt=!!b.gradientMap,st=!!b.alphaMap,tt=b.alphaTest>0,j=!!b.alphaHash,gt=!!b.extensions;let Xt=xr;b.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(Xt=n.toneMapping);const Pe={shaderID:it,shaderType:b.type,shaderName:b.name,vertexShader:ve,fragmentShader:Te,defines:b.defines,customVertexShaderID:Ce,customFragmentShaderID:Y,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:St,batchingColor:St&&k._colorsTexture!==null,instancing:Yt,instancingColor:Yt&&k.instanceColor!==null,instancingMorph:Yt&&k.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:K===null?n.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:Hs,alphaToCoverage:!!b.alphaToCoverage,map:ie,matcap:nn,envMap:ne,envMapMode:ne&&Q.mapping,envMapCubeUVHeight:G,aoMap:Fe,lightMap:C,bumpMap:re,normalMap:se,displacementMap:d&&Re,emissiveMap:_t,normalMapObjectSpace:se&&b.normalMapType===Iv,normalMapTangentSpace:se&&b.normalMapType===J0,metalnessMap:Oe,roughnessMap:wt,anisotropy:qt,anisotropyMap:H,clearcoat:M,clearcoatMap:bt,clearcoatNormalMap:ct,clearcoatRoughnessMap:It,dispersion:x,iridescence:N,iridescenceMap:vt,iridescenceThicknessMap:Z,sheen:q,sheenColorMap:nt,sheenRoughnessMap:zt,specularMap:Ft,specularColorMap:ht,specularIntensityMap:Ht,transmission:J,transmissionMap:R,thicknessMap:lt,gradientMap:rt,opaque:b.transparent===!1&&b.blending===Ds&&b.alphaToCoverage===!1,alphaMap:st,alphaTest:tt,alphaHash:j,combine:b.combine,mapUv:ie&&_(b.map.channel),aoMapUv:Fe&&_(b.aoMap.channel),lightMapUv:C&&_(b.lightMap.channel),bumpMapUv:re&&_(b.bumpMap.channel),normalMapUv:se&&_(b.normalMap.channel),displacementMapUv:Re&&_(b.displacementMap.channel),emissiveMapUv:_t&&_(b.emissiveMap.channel),metalnessMapUv:Oe&&_(b.metalnessMap.channel),roughnessMapUv:wt&&_(b.roughnessMap.channel),anisotropyMapUv:H&&_(b.anisotropyMap.channel),clearcoatMapUv:bt&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:ct&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:It&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:vt&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:Z&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:nt&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:zt&&_(b.sheenRoughnessMap.channel),specularMapUv:Ft&&_(b.specularMap.channel),specularColorMapUv:ht&&_(b.specularColorMap.channel),specularIntensityMapUv:Ht&&_(b.specularIntensityMap.channel),transmissionMapUv:R&&_(b.transmissionMap.channel),thicknessMapUv:lt&&_(b.thicknessMap.channel),alphaMapUv:st&&_(b.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(se||qt),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!W.attributes.uv&&(ie||st),fog:!!X,useFog:b.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:pt,skinning:k.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:Rt,morphTextureStride:ae,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:Xt,decodeVideoTexture:ie&&b.map.isVideoTexture===!0&&ue.getTransfer(b.map.colorSpace)===Se,decodeVideoTextureEmissive:_t&&b.emissiveMap.isVideoTexture===!0&&ue.getTransfer(b.emissiveMap.colorSpace)===Se,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===on,flipSided:b.side===Mn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:gt&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(gt&&b.extensions.multiDraw===!0||St)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Pe.vertexUv1s=l.has(1),Pe.vertexUv2s=l.has(2),Pe.vertexUv3s=l.has(3),l.clear(),Pe}function p(b){const y=[];if(b.shaderID?y.push(b.shaderID):(y.push(b.customVertexShaderID),y.push(b.customFragmentShaderID)),b.defines!==void 0)for(const L in b.defines)y.push(L),y.push(b.defines[L]);return b.isRawShaderMaterial===!1&&(A(y,b),S(y,b),y.push(n.outputColorSpace)),y.push(b.customProgramCacheKey),y.join()}function A(b,y){b.push(y.precision),b.push(y.outputColorSpace),b.push(y.envMapMode),b.push(y.envMapCubeUVHeight),b.push(y.mapUv),b.push(y.alphaMapUv),b.push(y.lightMapUv),b.push(y.aoMapUv),b.push(y.bumpMapUv),b.push(y.normalMapUv),b.push(y.displacementMapUv),b.push(y.emissiveMapUv),b.push(y.metalnessMapUv),b.push(y.roughnessMapUv),b.push(y.anisotropyMapUv),b.push(y.clearcoatMapUv),b.push(y.clearcoatNormalMapUv),b.push(y.clearcoatRoughnessMapUv),b.push(y.iridescenceMapUv),b.push(y.iridescenceThicknessMapUv),b.push(y.sheenColorMapUv),b.push(y.sheenRoughnessMapUv),b.push(y.specularMapUv),b.push(y.specularColorMapUv),b.push(y.specularIntensityMapUv),b.push(y.transmissionMapUv),b.push(y.thicknessMapUv),b.push(y.combine),b.push(y.fogExp2),b.push(y.sizeAttenuation),b.push(y.morphTargetsCount),b.push(y.morphAttributeCount),b.push(y.numDirLights),b.push(y.numPointLights),b.push(y.numSpotLights),b.push(y.numSpotLightMaps),b.push(y.numHemiLights),b.push(y.numRectAreaLights),b.push(y.numDirLightShadows),b.push(y.numPointLightShadows),b.push(y.numSpotLightShadows),b.push(y.numSpotLightShadowsWithMaps),b.push(y.numLightProbes),b.push(y.shadowMapType),b.push(y.toneMapping),b.push(y.numClippingPlanes),b.push(y.numClipIntersection),b.push(y.depthPacking)}function S(b,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),y.gradientMap&&a.enable(22),b.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reversedDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),b.push(a.mask)}function w(b){const y=g[b.type];let L;if(y){const B=Si[y];L=yy.clone(B.uniforms)}else L=b.uniforms;return L}function I(b,y){let L;for(let B=0,k=u.length;B<k;B++){const X=u[B];if(X.cacheKey===y){L=X,++L.usedTimes;break}}return L===void 0&&(L=new Cw(n,y,b,s),u.push(L)),L}function E(b){if(--b.usedTimes===0){const y=u.indexOf(b);u[y]=u[u.length-1],u.pop(),b.destroy()}}function D(b){c.remove(b)}function O(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:w,acquireProgram:I,releaseProgram:E,releaseShaderCache:D,programs:u,dispose:O}}function Pw(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,c){n.get(o)[a]=c}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:r,dispose:s}}function Uw(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function wf(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Af(){const n=[];let t=0;const e=[],i=[],r=[];function s(){t=0,e.length=0,i.length=0,r.length=0}function o(h,d,f,g,_,m){let p=n[t];return p===void 0?(p={id:h.id,object:h,geometry:d,material:f,groupOrder:g,renderOrder:h.renderOrder,z:_,group:m},n[t]=p):(p.id=h.id,p.object=h,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=h.renderOrder,p.z=_,p.group=m),t++,p}function a(h,d,f,g,_,m){const p=o(h,d,f,g,_,m);f.transmission>0?i.push(p):f.transparent===!0?r.push(p):e.push(p)}function c(h,d,f,g,_,m){const p=o(h,d,f,g,_,m);f.transmission>0?i.unshift(p):f.transparent===!0?r.unshift(p):e.unshift(p)}function l(h,d){e.length>1&&e.sort(h||Uw),i.length>1&&i.sort(d||wf),r.length>1&&r.sort(d||wf)}function u(){for(let h=t,d=n.length;h<d;h++){const f=n[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:i,transparent:r,init:s,push:a,unshift:c,finish:u,sort:l}}function Fw(){let n=new WeakMap;function t(i,r){const s=n.get(i);let o;return s===void 0?(o=new Af,n.set(i,[o])):r>=s.length?(o=new Af,s.push(o)):o=s[r],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function Nw(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new T,color:new Zt};break;case"SpotLight":e={position:new T,direction:new T,color:new Zt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new T,color:new Zt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new T,skyColor:new Zt,groundColor:new Zt};break;case"RectAreaLight":e={color:new Zt,position:new T,halfWidth:new T,halfHeight:new T};break}return n[t.id]=e,e}}}function Bw(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let Ow=0;function zw(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function Vw(n){const t=new Nw,e=Bw(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new T);const r=new T,s=new De,o=new De;function a(l){let u=0,h=0,d=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,A=0,S=0,w=0,I=0,E=0,D=0;l.sort(zw);for(let b=0,y=l.length;b<y;b++){const L=l[b],B=L.color,k=L.intensity,X=L.distance,W=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)u+=B.r*k,h+=B.g*k,d+=B.b*k;else if(L.isLightProbe){for(let $=0;$<9;$++)i.probe[$].addScaledVector(L.sh.coefficients[$],k);D++}else if(L.isDirectionalLight){const $=t.get(L);if($.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const Q=L.shadow,G=e.get(L);G.shadowIntensity=Q.intensity,G.shadowBias=Q.bias,G.shadowNormalBias=Q.normalBias,G.shadowRadius=Q.radius,G.shadowMapSize=Q.mapSize,i.directionalShadow[f]=G,i.directionalShadowMap[f]=W,i.directionalShadowMatrix[f]=L.shadow.matrix,A++}i.directional[f]=$,f++}else if(L.isSpotLight){const $=t.get(L);$.position.setFromMatrixPosition(L.matrixWorld),$.color.copy(B).multiplyScalar(k),$.distance=X,$.coneCos=Math.cos(L.angle),$.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),$.decay=L.decay,i.spot[_]=$;const Q=L.shadow;if(L.map&&(i.spotLightMap[I]=L.map,I++,Q.updateMatrices(L),L.castShadow&&E++),i.spotLightMatrix[_]=Q.matrix,L.castShadow){const G=e.get(L);G.shadowIntensity=Q.intensity,G.shadowBias=Q.bias,G.shadowNormalBias=Q.normalBias,G.shadowRadius=Q.radius,G.shadowMapSize=Q.mapSize,i.spotShadow[_]=G,i.spotShadowMap[_]=W,w++}_++}else if(L.isRectAreaLight){const $=t.get(L);$.color.copy(B).multiplyScalar(k),$.halfWidth.set(L.width*.5,0,0),$.halfHeight.set(0,L.height*.5,0),i.rectArea[m]=$,m++}else if(L.isPointLight){const $=t.get(L);if($.color.copy(L.color).multiplyScalar(L.intensity),$.distance=L.distance,$.decay=L.decay,L.castShadow){const Q=L.shadow,G=e.get(L);G.shadowIntensity=Q.intensity,G.shadowBias=Q.bias,G.shadowNormalBias=Q.normalBias,G.shadowRadius=Q.radius,G.shadowMapSize=Q.mapSize,G.shadowCameraNear=Q.camera.near,G.shadowCameraFar=Q.camera.far,i.pointShadow[g]=G,i.pointShadowMap[g]=W,i.pointShadowMatrix[g]=L.shadow.matrix,S++}i.point[g]=$,g++}else if(L.isHemisphereLight){const $=t.get(L);$.skyColor.copy(L.color).multiplyScalar(k),$.groundColor.copy(L.groundColor).multiplyScalar(k),i.hemi[p]=$,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=at.LTC_FLOAT_1,i.rectAreaLTC2=at.LTC_FLOAT_2):(i.rectAreaLTC1=at.LTC_HALF_1,i.rectAreaLTC2=at.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=d;const O=i.hash;(O.directionalLength!==f||O.pointLength!==g||O.spotLength!==_||O.rectAreaLength!==m||O.hemiLength!==p||O.numDirectionalShadows!==A||O.numPointShadows!==S||O.numSpotShadows!==w||O.numSpotMaps!==I||O.numLightProbes!==D)&&(i.directional.length=f,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=A,i.directionalShadowMap.length=A,i.pointShadow.length=S,i.pointShadowMap.length=S,i.spotShadow.length=w,i.spotShadowMap.length=w,i.directionalShadowMatrix.length=A,i.pointShadowMatrix.length=S,i.spotLightMatrix.length=w+I-E,i.spotLightMap.length=I,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=D,O.directionalLength=f,O.pointLength=g,O.spotLength=_,O.rectAreaLength=m,O.hemiLength=p,O.numDirectionalShadows=A,O.numPointShadows=S,O.numSpotShadows=w,O.numSpotMaps=I,O.numLightProbes=D,i.version=Ow++)}function c(l,u){let h=0,d=0,f=0,g=0,_=0;const m=u.matrixWorldInverse;for(let p=0,A=l.length;p<A;p++){const S=l[p];if(S.isDirectionalLight){const w=i.directional[h];w.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(m),h++}else if(S.isSpotLight){const w=i.spot[f];w.position.setFromMatrixPosition(S.matrixWorld),w.position.applyMatrix4(m),w.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(m),f++}else if(S.isRectAreaLight){const w=i.rectArea[g];w.position.setFromMatrixPosition(S.matrixWorld),w.position.applyMatrix4(m),o.identity(),s.copy(S.matrixWorld),s.premultiply(m),o.extractRotation(s),w.halfWidth.set(S.width*.5,0,0),w.halfHeight.set(0,S.height*.5,0),w.halfWidth.applyMatrix4(o),w.halfHeight.applyMatrix4(o),g++}else if(S.isPointLight){const w=i.point[d];w.position.setFromMatrixPosition(S.matrixWorld),w.position.applyMatrix4(m),d++}else if(S.isHemisphereLight){const w=i.hemi[_];w.direction.setFromMatrixPosition(S.matrixWorld),w.direction.transformDirection(m),_++}}}return{setup:a,setupView:c,state:i}}function Ef(n){const t=new Vw(n),e=[],i=[];function r(u){l.camera=u,e.length=0,i.length=0}function s(u){e.push(u)}function o(u){i.push(u)}function a(){t.setup(e)}function c(u){t.setupView(e,u)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:a,setupLightsView:c,pushLight:s,pushShadow:o}}function kw(n){let t=new WeakMap;function e(r,s=0){const o=t.get(r);let a;return o===void 0?(a=new Ef(n),t.set(r,[a])):s>=o.length?(a=new Ef(n),o.push(a)):a=o[s],a}function i(){t=new WeakMap}return{get:e,dispose:i}}const Hw=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Gw=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Ww(n,t,e){let i=new gh;const r=new ft,s=new ft,o=new Xe,a=new hb({depthPacking:Rv}),c=new db,l={},u=e.maxTextureSize,h={[br]:Mn,[Mn]:br,[on]:on},d=new er({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ft},radius:{value:4}},vertexShader:Hw,fragmentShader:Gw}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new Ee;g.setAttribute("position",new wn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new mt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=k0;let p=this.type;this.render=function(E,D,O){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;const b=n.getRenderTarget(),y=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),B=n.state;B.setBlending(Zi),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const k=p!==Hi&&this.type===Hi,X=p===Hi&&this.type!==Hi;for(let W=0,$=E.length;W<$;W++){const Q=E[W],G=Q.shadow;if(G===void 0){Gt("WebGLShadowMap:",Q,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;r.copy(G.mapSize);const it=G.getFrameExtents();if(r.multiply(it),s.copy(G.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/it.x),r.x=s.x*it.x,G.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/it.y),r.y=s.y*it.y,G.mapSize.y=s.y)),G.map===null||k===!0||X===!0){const Rt=this.type!==Hi?{minFilter:Gn,magFilter:Gn}:{};G.map!==null&&G.map.dispose(),G.map=new Gr(r.x,r.y,Rt),G.map.texture.name=Q.name+".shadowMap",G.camera.updateProjectionMatrix()}n.setRenderTarget(G.map),n.clear();const ot=G.getViewportCount();for(let Rt=0;Rt<ot;Rt++){const ae=G.getViewport(Rt);o.set(s.x*ae.x,s.y*ae.y,s.x*ae.z,s.y*ae.w),B.viewport(o),G.updateMatrices(Q,Rt),i=G.getFrustum(),w(D,O,G.camera,Q,this.type)}G.isPointLightShadow!==!0&&this.type===Hi&&A(G,O),G.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(b,y,L)};function A(E,D){const O=t.update(_);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Gr(r.x,r.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,n.setRenderTarget(E.mapPass),n.clear(),n.renderBufferDirect(D,null,O,d,_,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,n.setRenderTarget(E.map),n.clear(),n.renderBufferDirect(D,null,O,f,_,null)}function S(E,D,O,b){let y=null;const L=O.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(L!==void 0)y=L;else if(y=O.isPointLight===!0?c:a,n.localClippingEnabled&&D.clipShadows===!0&&Array.isArray(D.clippingPlanes)&&D.clippingPlanes.length!==0||D.displacementMap&&D.displacementScale!==0||D.alphaMap&&D.alphaTest>0||D.map&&D.alphaTest>0||D.alphaToCoverage===!0){const B=y.uuid,k=D.uuid;let X=l[B];X===void 0&&(X={},l[B]=X);let W=X[k];W===void 0&&(W=y.clone(),X[k]=W,D.addEventListener("dispose",I)),y=W}if(y.visible=D.visible,y.wireframe=D.wireframe,b===Hi?y.side=D.shadowSide!==null?D.shadowSide:D.side:y.side=D.shadowSide!==null?D.shadowSide:h[D.side],y.alphaMap=D.alphaMap,y.alphaTest=D.alphaToCoverage===!0?.5:D.alphaTest,y.map=D.map,y.clipShadows=D.clipShadows,y.clippingPlanes=D.clippingPlanes,y.clipIntersection=D.clipIntersection,y.displacementMap=D.displacementMap,y.displacementScale=D.displacementScale,y.displacementBias=D.displacementBias,y.wireframeLinewidth=D.wireframeLinewidth,y.linewidth=D.linewidth,O.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const B=n.properties.get(y);B.light=O}return y}function w(E,D,O,b,y){if(E.visible===!1)return;if(E.layers.test(D.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&y===Hi)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse,E.matrixWorld);const k=t.update(E),X=E.material;if(Array.isArray(X)){const W=k.groups;for(let $=0,Q=W.length;$<Q;$++){const G=W[$],it=X[G.materialIndex];if(it&&it.visible){const ot=S(E,it,b,y);E.onBeforeShadow(n,E,D,O,k,ot,G),n.renderBufferDirect(O,null,k,ot,E,G),E.onAfterShadow(n,E,D,O,k,ot,G)}}}else if(X.visible){const W=S(E,X,b,y);E.onBeforeShadow(n,E,D,O,k,W,null),n.renderBufferDirect(O,null,k,W,E,null),E.onAfterShadow(n,E,D,O,k,W,null)}}const B=E.children;for(let k=0,X=B.length;k<X;k++)w(B[k],D,O,b,y)}function I(E){E.target.removeEventListener("dispose",I);for(const O in l){const b=l[O],y=E.target.uuid;y in b&&(b[y].dispose(),delete b[y])}}}const Xw={[ql]:Yl,[$l]:Kl,[jl]:Zl,[zs]:Jl,[Yl]:ql,[Kl]:$l,[Zl]:jl,[Jl]:zs};function qw(n,t){function e(){let R=!1;const lt=new Xe;let rt=null;const st=new Xe(0,0,0,0);return{setMask:function(tt){rt!==tt&&!R&&(n.colorMask(tt,tt,tt,tt),rt=tt)},setLocked:function(tt){R=tt},setClear:function(tt,j,gt,Xt,Pe){Pe===!0&&(tt*=Xt,j*=Xt,gt*=Xt),lt.set(tt,j,gt,Xt),st.equals(lt)===!1&&(n.clearColor(tt,j,gt,Xt),st.copy(lt))},reset:function(){R=!1,rt=null,st.set(-1,0,0,0)}}}function i(){let R=!1,lt=!1,rt=null,st=null,tt=null;return{setReversed:function(j){if(lt!==j){const gt=t.get("EXT_clip_control");j?gt.clipControlEXT(gt.LOWER_LEFT_EXT,gt.ZERO_TO_ONE_EXT):gt.clipControlEXT(gt.LOWER_LEFT_EXT,gt.NEGATIVE_ONE_TO_ONE_EXT),lt=j;const Xt=tt;tt=null,this.setClear(Xt)}},getReversed:function(){return lt},setTest:function(j){j?K(n.DEPTH_TEST):pt(n.DEPTH_TEST)},setMask:function(j){rt!==j&&!R&&(n.depthMask(j),rt=j)},setFunc:function(j){if(lt&&(j=Xw[j]),st!==j){switch(j){case ql:n.depthFunc(n.NEVER);break;case Yl:n.depthFunc(n.ALWAYS);break;case $l:n.depthFunc(n.LESS);break;case zs:n.depthFunc(n.LEQUAL);break;case jl:n.depthFunc(n.EQUAL);break;case Jl:n.depthFunc(n.GEQUAL);break;case Kl:n.depthFunc(n.GREATER);break;case Zl:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}st=j}},setLocked:function(j){R=j},setClear:function(j){tt!==j&&(lt&&(j=1-j),n.clearDepth(j),tt=j)},reset:function(){R=!1,rt=null,st=null,tt=null,lt=!1}}}function r(){let R=!1,lt=null,rt=null,st=null,tt=null,j=null,gt=null,Xt=null,Pe=null;return{setTest:function(ye){R||(ye?K(n.STENCIL_TEST):pt(n.STENCIL_TEST))},setMask:function(ye){lt!==ye&&!R&&(n.stencilMask(ye),lt=ye)},setFunc:function(ye,gi,ii){(rt!==ye||st!==gi||tt!==ii)&&(n.stencilFunc(ye,gi,ii),rt=ye,st=gi,tt=ii)},setOp:function(ye,gi,ii){(j!==ye||gt!==gi||Xt!==ii)&&(n.stencilOp(ye,gi,ii),j=ye,gt=gi,Xt=ii)},setLocked:function(ye){R=ye},setClear:function(ye){Pe!==ye&&(n.clearStencil(ye),Pe=ye)},reset:function(){R=!1,lt=null,rt=null,st=null,tt=null,j=null,gt=null,Xt=null,Pe=null}}}const s=new e,o=new i,a=new r,c=new WeakMap,l=new WeakMap;let u={},h={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,A=null,S=null,w=null,I=null,E=null,D=new Zt(0,0,0),O=0,b=!1,y=null,L=null,B=null,k=null,X=null;const W=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let $=!1,Q=0;const G=n.getParameter(n.VERSION);G.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(G)[1]),$=Q>=1):G.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),$=Q>=2);let it=null,ot={};const Rt=n.getParameter(n.SCISSOR_BOX),ae=n.getParameter(n.VIEWPORT),ve=new Xe().fromArray(Rt),Te=new Xe().fromArray(ae);function Ce(R,lt,rt,st){const tt=new Uint8Array(4),j=n.createTexture();n.bindTexture(R,j),n.texParameteri(R,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(R,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let gt=0;gt<rt;gt++)R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY?n.texImage3D(lt,0,n.RGBA,1,1,st,0,n.RGBA,n.UNSIGNED_BYTE,tt):n.texImage2D(lt+gt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,tt);return j}const Y={};Y[n.TEXTURE_2D]=Ce(n.TEXTURE_2D,n.TEXTURE_2D,1),Y[n.TEXTURE_CUBE_MAP]=Ce(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[n.TEXTURE_2D_ARRAY]=Ce(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Y[n.TEXTURE_3D]=Ce(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),K(n.DEPTH_TEST),o.setFunc(zs),re(!1),se(pd),K(n.CULL_FACE),Fe(Zi);function K(R){u[R]!==!0&&(n.enable(R),u[R]=!0)}function pt(R){u[R]!==!1&&(n.disable(R),u[R]=!1)}function Yt(R,lt){return h[R]!==lt?(n.bindFramebuffer(R,lt),h[R]=lt,R===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=lt),R===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=lt),!0):!1}function St(R,lt){let rt=f,st=!1;if(R){rt=d.get(lt),rt===void 0&&(rt=[],d.set(lt,rt));const tt=R.textures;if(rt.length!==tt.length||rt[0]!==n.COLOR_ATTACHMENT0){for(let j=0,gt=tt.length;j<gt;j++)rt[j]=n.COLOR_ATTACHMENT0+j;rt.length=tt.length,st=!0}}else rt[0]!==n.BACK&&(rt[0]=n.BACK,st=!0);st&&n.drawBuffers(rt)}function ie(R){return g!==R?(n.useProgram(R),g=R,!0):!1}const nn={[Fr]:n.FUNC_ADD,[ev]:n.FUNC_SUBTRACT,[nv]:n.FUNC_REVERSE_SUBTRACT};nn[iv]=n.MIN,nn[rv]=n.MAX;const ne={[sv]:n.ZERO,[ov]:n.ONE,[av]:n.SRC_COLOR,[Wl]:n.SRC_ALPHA,[fv]:n.SRC_ALPHA_SATURATE,[hv]:n.DST_COLOR,[lv]:n.DST_ALPHA,[cv]:n.ONE_MINUS_SRC_COLOR,[Xl]:n.ONE_MINUS_SRC_ALPHA,[dv]:n.ONE_MINUS_DST_COLOR,[uv]:n.ONE_MINUS_DST_ALPHA,[pv]:n.CONSTANT_COLOR,[mv]:n.ONE_MINUS_CONSTANT_COLOR,[gv]:n.CONSTANT_ALPHA,[xv]:n.ONE_MINUS_CONSTANT_ALPHA};function Fe(R,lt,rt,st,tt,j,gt,Xt,Pe,ye){if(R===Zi){_===!0&&(pt(n.BLEND),_=!1);return}if(_===!1&&(K(n.BLEND),_=!0),R!==tv){if(R!==m||ye!==b){if((p!==Fr||w!==Fr)&&(n.blendEquation(n.FUNC_ADD),p=Fr,w=Fr),ye)switch(R){case Ds:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case md:n.blendFunc(n.ONE,n.ONE);break;case gd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case xd:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:qe("WebGLState: Invalid blending: ",R);break}else switch(R){case Ds:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case md:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case gd:qe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case xd:qe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:qe("WebGLState: Invalid blending: ",R);break}A=null,S=null,I=null,E=null,D.set(0,0,0),O=0,m=R,b=ye}return}tt=tt||lt,j=j||rt,gt=gt||st,(lt!==p||tt!==w)&&(n.blendEquationSeparate(nn[lt],nn[tt]),p=lt,w=tt),(rt!==A||st!==S||j!==I||gt!==E)&&(n.blendFuncSeparate(ne[rt],ne[st],ne[j],ne[gt]),A=rt,S=st,I=j,E=gt),(Xt.equals(D)===!1||Pe!==O)&&(n.blendColor(Xt.r,Xt.g,Xt.b,Pe),D.copy(Xt),O=Pe),m=R,b=!1}function C(R,lt){R.side===on?pt(n.CULL_FACE):K(n.CULL_FACE);let rt=R.side===Mn;lt&&(rt=!rt),re(rt),R.blending===Ds&&R.transparent===!1?Fe(Zi):Fe(R.blending,R.blendEquation,R.blendSrc,R.blendDst,R.blendEquationAlpha,R.blendSrcAlpha,R.blendDstAlpha,R.blendColor,R.blendAlpha,R.premultipliedAlpha),o.setFunc(R.depthFunc),o.setTest(R.depthTest),o.setMask(R.depthWrite),s.setMask(R.colorWrite);const st=R.stencilWrite;a.setTest(st),st&&(a.setMask(R.stencilWriteMask),a.setFunc(R.stencilFunc,R.stencilRef,R.stencilFuncMask),a.setOp(R.stencilFail,R.stencilZFail,R.stencilZPass)),_t(R.polygonOffset,R.polygonOffsetFactor,R.polygonOffsetUnits),R.alphaToCoverage===!0?K(n.SAMPLE_ALPHA_TO_COVERAGE):pt(n.SAMPLE_ALPHA_TO_COVERAGE)}function re(R){y!==R&&(R?n.frontFace(n.CW):n.frontFace(n.CCW),y=R)}function se(R){R!==K_?(K(n.CULL_FACE),R!==L&&(R===pd?n.cullFace(n.BACK):R===Z_?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):pt(n.CULL_FACE),L=R}function Re(R){R!==B&&($&&n.lineWidth(R),B=R)}function _t(R,lt,rt){R?(K(n.POLYGON_OFFSET_FILL),(k!==lt||X!==rt)&&(n.polygonOffset(lt,rt),k=lt,X=rt)):pt(n.POLYGON_OFFSET_FILL)}function Oe(R){R?K(n.SCISSOR_TEST):pt(n.SCISSOR_TEST)}function wt(R){R===void 0&&(R=n.TEXTURE0+W-1),it!==R&&(n.activeTexture(R),it=R)}function qt(R,lt,rt){rt===void 0&&(it===null?rt=n.TEXTURE0+W-1:rt=it);let st=ot[rt];st===void 0&&(st={type:void 0,texture:void 0},ot[rt]=st),(st.type!==R||st.texture!==lt)&&(it!==rt&&(n.activeTexture(rt),it=rt),n.bindTexture(R,lt||Y[R]),st.type=R,st.texture=lt)}function M(){const R=ot[it];R!==void 0&&R.type!==void 0&&(n.bindTexture(R.type,null),R.type=void 0,R.texture=void 0)}function x(){try{n.compressedTexImage2D(...arguments)}catch(R){R("WebGLState:",R)}}function N(){try{n.compressedTexImage3D(...arguments)}catch(R){R("WebGLState:",R)}}function q(){try{n.texSubImage2D(...arguments)}catch(R){R("WebGLState:",R)}}function J(){try{n.texSubImage3D(...arguments)}catch(R){R("WebGLState:",R)}}function H(){try{n.compressedTexSubImage2D(...arguments)}catch(R){R("WebGLState:",R)}}function bt(){try{n.compressedTexSubImage3D(...arguments)}catch(R){R("WebGLState:",R)}}function ct(){try{n.texStorage2D(...arguments)}catch(R){R("WebGLState:",R)}}function It(){try{n.texStorage3D(...arguments)}catch(R){R("WebGLState:",R)}}function vt(){try{n.texImage2D(...arguments)}catch(R){R("WebGLState:",R)}}function Z(){try{n.texImage3D(...arguments)}catch(R){R("WebGLState:",R)}}function nt(R){ve.equals(R)===!1&&(n.scissor(R.x,R.y,R.z,R.w),ve.copy(R))}function zt(R){Te.equals(R)===!1&&(n.viewport(R.x,R.y,R.z,R.w),Te.copy(R))}function Ft(R,lt){let rt=l.get(lt);rt===void 0&&(rt=new WeakMap,l.set(lt,rt));let st=rt.get(R);st===void 0&&(st=n.getUniformBlockIndex(lt,R.name),rt.set(R,st))}function ht(R,lt){const st=l.get(lt).get(R);c.get(lt)!==st&&(n.uniformBlockBinding(lt,st,R.__bindingPointIndex),c.set(lt,st))}function Ht(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},it=null,ot={},h={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,A=null,S=null,w=null,I=null,E=null,D=new Zt(0,0,0),O=0,b=!1,y=null,L=null,B=null,k=null,X=null,ve.set(0,0,n.canvas.width,n.canvas.height),Te.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:K,disable:pt,bindFramebuffer:Yt,drawBuffers:St,useProgram:ie,setBlending:Fe,setMaterial:C,setFlipSided:re,setCullFace:se,setLineWidth:Re,setPolygonOffset:_t,setScissorTest:Oe,activeTexture:wt,bindTexture:qt,unbindTexture:M,compressedTexImage2D:x,compressedTexImage3D:N,texImage2D:vt,texImage3D:Z,updateUBOMapping:Ft,uniformBlockBinding:ht,texStorage2D:ct,texStorage3D:It,texSubImage2D:q,texSubImage3D:J,compressedTexSubImage2D:H,compressedTexSubImage3D:bt,scissor:nt,viewport:zt,reset:Ht}}function Yw(n,t,e,i,r,s,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ft,u=new WeakMap;let h;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(M,x){return f?new OffscreenCanvas(M,x):Mc("canvas")}function _(M,x,N){let q=1;const J=qt(M);if((J.width>N||J.height>N)&&(q=N/Math.max(J.width,J.height)),q<1)if(typeof HTMLImageElement<"u"&&M instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&M instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&M instanceof ImageBitmap||typeof VideoFrame<"u"&&M instanceof VideoFrame){const H=Math.floor(q*J.width),bt=Math.floor(q*J.height);h===void 0&&(h=g(H,bt));const ct=x?g(H,bt):h;return ct.width=H,ct.height=bt,ct.getContext("2d").drawImage(M,0,0,H,bt),Gt("WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+H+"x"+bt+")."),ct}else return"data"in M&&Gt("WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),M;return M}function m(M){return M.generateMipmaps}function p(M){n.generateMipmap(M)}function A(M){return M.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:M.isWebGL3DRenderTarget?n.TEXTURE_3D:M.isWebGLArrayRenderTarget||M.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function S(M,x,N,q,J=!1){if(M!==null){if(n[M]!==void 0)return n[M];Gt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+M+"'")}let H=x;if(x===n.RED&&(N===n.FLOAT&&(H=n.R32F),N===n.HALF_FLOAT&&(H=n.R16F),N===n.UNSIGNED_BYTE&&(H=n.R8)),x===n.RED_INTEGER&&(N===n.UNSIGNED_BYTE&&(H=n.R8UI),N===n.UNSIGNED_SHORT&&(H=n.R16UI),N===n.UNSIGNED_INT&&(H=n.R32UI),N===n.BYTE&&(H=n.R8I),N===n.SHORT&&(H=n.R16I),N===n.INT&&(H=n.R32I)),x===n.RG&&(N===n.FLOAT&&(H=n.RG32F),N===n.HALF_FLOAT&&(H=n.RG16F),N===n.UNSIGNED_BYTE&&(H=n.RG8)),x===n.RG_INTEGER&&(N===n.UNSIGNED_BYTE&&(H=n.RG8UI),N===n.UNSIGNED_SHORT&&(H=n.RG16UI),N===n.UNSIGNED_INT&&(H=n.RG32UI),N===n.BYTE&&(H=n.RG8I),N===n.SHORT&&(H=n.RG16I),N===n.INT&&(H=n.RG32I)),x===n.RGB_INTEGER&&(N===n.UNSIGNED_BYTE&&(H=n.RGB8UI),N===n.UNSIGNED_SHORT&&(H=n.RGB16UI),N===n.UNSIGNED_INT&&(H=n.RGB32UI),N===n.BYTE&&(H=n.RGB8I),N===n.SHORT&&(H=n.RGB16I),N===n.INT&&(H=n.RGB32I)),x===n.RGBA_INTEGER&&(N===n.UNSIGNED_BYTE&&(H=n.RGBA8UI),N===n.UNSIGNED_SHORT&&(H=n.RGBA16UI),N===n.UNSIGNED_INT&&(H=n.RGBA32UI),N===n.BYTE&&(H=n.RGBA8I),N===n.SHORT&&(H=n.RGBA16I),N===n.INT&&(H=n.RGBA32I)),x===n.RGB&&(N===n.UNSIGNED_INT_5_9_9_9_REV&&(H=n.RGB9_E5),N===n.UNSIGNED_INT_10F_11F_11F_REV&&(H=n.R11F_G11F_B10F)),x===n.RGBA){const bt=J?bc:ue.getTransfer(q);N===n.FLOAT&&(H=n.RGBA32F),N===n.HALF_FLOAT&&(H=n.RGBA16F),N===n.UNSIGNED_BYTE&&(H=bt===Se?n.SRGB8_ALPHA8:n.RGBA8),N===n.UNSIGNED_SHORT_4_4_4_4&&(H=n.RGBA4),N===n.UNSIGNED_SHORT_5_5_5_1&&(H=n.RGB5_A1)}return(H===n.R16F||H===n.R32F||H===n.RG16F||H===n.RG32F||H===n.RGBA16F||H===n.RGBA32F)&&t.get("EXT_color_buffer_float"),H}function w(M,x){let N;return M?x===null||x===Hr||x===No?N=n.DEPTH24_STENCIL8:x===Ci?N=n.DEPTH32F_STENCIL8:x===Fo&&(N=n.DEPTH24_STENCIL8,Gt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Hr||x===No?N=n.DEPTH_COMPONENT24:x===Ci?N=n.DEPTH_COMPONENT32F:x===Fo&&(N=n.DEPTH_COMPONENT16),N}function I(M,x){return m(M)===!0||M.isFramebufferTexture&&M.minFilter!==Gn&&M.minFilter!==Qn?Math.log2(Math.max(x.width,x.height))+1:M.mipmaps!==void 0&&M.mipmaps.length>0?M.mipmaps.length:M.isCompressedTexture&&Array.isArray(M.image)?x.mipmaps.length:1}function E(M){const x=M.target;x.removeEventListener("dispose",E),O(x),x.isVideoTexture&&u.delete(x)}function D(M){const x=M.target;x.removeEventListener("dispose",D),y(x)}function O(M){const x=i.get(M);if(x.__webglInit===void 0)return;const N=M.source,q=d.get(N);if(q){const J=q[x.__cacheKey];J.usedTimes--,J.usedTimes===0&&b(M),Object.keys(q).length===0&&d.delete(N)}i.remove(M)}function b(M){const x=i.get(M);n.deleteTexture(x.__webglTexture);const N=M.source,q=d.get(N);delete q[x.__cacheKey],o.memory.textures--}function y(M){const x=i.get(M);if(M.depthTexture&&(M.depthTexture.dispose(),i.remove(M.depthTexture)),M.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(x.__webglFramebuffer[q]))for(let J=0;J<x.__webglFramebuffer[q].length;J++)n.deleteFramebuffer(x.__webglFramebuffer[q][J]);else n.deleteFramebuffer(x.__webglFramebuffer[q]);x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer[q])}else{if(Array.isArray(x.__webglFramebuffer))for(let q=0;q<x.__webglFramebuffer.length;q++)n.deleteFramebuffer(x.__webglFramebuffer[q]);else n.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&n.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let q=0;q<x.__webglColorRenderbuffer.length;q++)x.__webglColorRenderbuffer[q]&&n.deleteRenderbuffer(x.__webglColorRenderbuffer[q]);x.__webglDepthRenderbuffer&&n.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const N=M.textures;for(let q=0,J=N.length;q<J;q++){const H=i.get(N[q]);H.__webglTexture&&(n.deleteTexture(H.__webglTexture),o.memory.textures--),i.remove(N[q])}i.remove(M)}let L=0;function B(){L=0}function k(){const M=L;return M>=r.maxTextures&&Gt("WebGLTextures: Trying to use "+M+" texture units while this GPU supports only "+r.maxTextures),L+=1,M}function X(M){const x=[];return x.push(M.wrapS),x.push(M.wrapT),x.push(M.wrapR||0),x.push(M.magFilter),x.push(M.minFilter),x.push(M.anisotropy),x.push(M.internalFormat),x.push(M.format),x.push(M.type),x.push(M.generateMipmaps),x.push(M.premultiplyAlpha),x.push(M.flipY),x.push(M.unpackAlignment),x.push(M.colorSpace),x.join()}function W(M,x){const N=i.get(M);if(M.isVideoTexture&&Oe(M),M.isRenderTargetTexture===!1&&M.isExternalTexture!==!0&&M.version>0&&N.__version!==M.version){const q=M.image;if(q===null)Gt("WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)Gt("WebGLRenderer: Texture marked for update but image is incomplete");else{Y(N,M,x);return}}else M.isExternalTexture&&(N.__webglTexture=M.sourceTexture?M.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,N.__webglTexture,n.TEXTURE0+x)}function $(M,x){const N=i.get(M);if(M.isRenderTargetTexture===!1&&M.version>0&&N.__version!==M.version){Y(N,M,x);return}else M.isExternalTexture&&(N.__webglTexture=M.sourceTexture?M.sourceTexture:null);e.bindTexture(n.TEXTURE_2D_ARRAY,N.__webglTexture,n.TEXTURE0+x)}function Q(M,x){const N=i.get(M);if(M.isRenderTargetTexture===!1&&M.version>0&&N.__version!==M.version){Y(N,M,x);return}e.bindTexture(n.TEXTURE_3D,N.__webglTexture,n.TEXTURE0+x)}function G(M,x){const N=i.get(M);if(M.version>0&&N.__version!==M.version){K(N,M,x);return}e.bindTexture(n.TEXTURE_CUBE_MAP,N.__webglTexture,n.TEXTURE0+x)}const it={[eu]:n.REPEAT,[ji]:n.CLAMP_TO_EDGE,[nu]:n.MIRRORED_REPEAT},ot={[Gn]:n.NEAREST,[Tv]:n.NEAREST_MIPMAP_NEAREST,[ra]:n.NEAREST_MIPMAP_LINEAR,[Qn]:n.LINEAR,[Zc]:n.LINEAR_MIPMAP_NEAREST,[Or]:n.LINEAR_MIPMAP_LINEAR},Rt={[Dv]:n.NEVER,[Bv]:n.ALWAYS,[Lv]:n.LESS,[K0]:n.LEQUAL,[Pv]:n.EQUAL,[Nv]:n.GEQUAL,[Uv]:n.GREATER,[Fv]:n.NOTEQUAL};function ae(M,x){if(x.type===Ci&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===Qn||x.magFilter===Zc||x.magFilter===ra||x.magFilter===Or||x.minFilter===Qn||x.minFilter===Zc||x.minFilter===ra||x.minFilter===Or)&&Gt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(M,n.TEXTURE_WRAP_S,it[x.wrapS]),n.texParameteri(M,n.TEXTURE_WRAP_T,it[x.wrapT]),(M===n.TEXTURE_3D||M===n.TEXTURE_2D_ARRAY)&&n.texParameteri(M,n.TEXTURE_WRAP_R,it[x.wrapR]),n.texParameteri(M,n.TEXTURE_MAG_FILTER,ot[x.magFilter]),n.texParameteri(M,n.TEXTURE_MIN_FILTER,ot[x.minFilter]),x.compareFunction&&(n.texParameteri(M,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(M,n.TEXTURE_COMPARE_FUNC,Rt[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Gn||x.minFilter!==ra&&x.minFilter!==Or||x.type===Ci&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){const N=t.get("EXT_texture_filter_anisotropic");n.texParameterf(M,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,r.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function ve(M,x){let N=!1;M.__webglInit===void 0&&(M.__webglInit=!0,x.addEventListener("dispose",E));const q=x.source;let J=d.get(q);J===void 0&&(J={},d.set(q,J));const H=X(x);if(H!==M.__cacheKey){J[H]===void 0&&(J[H]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,N=!0),J[H].usedTimes++;const bt=J[M.__cacheKey];bt!==void 0&&(J[M.__cacheKey].usedTimes--,bt.usedTimes===0&&b(x)),M.__cacheKey=H,M.__webglTexture=J[H].texture}return N}function Te(M,x,N){return Math.floor(Math.floor(M/N)/x)}function Ce(M,x,N,q){const H=M.updateRanges;if(H.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,x.width,x.height,N,q,x.data);else{H.sort((Z,nt)=>Z.start-nt.start);let bt=0;for(let Z=1;Z<H.length;Z++){const nt=H[bt],zt=H[Z],Ft=nt.start+nt.count,ht=Te(zt.start,x.width,4),Ht=Te(nt.start,x.width,4);zt.start<=Ft+1&&ht===Ht&&Te(zt.start+zt.count-1,x.width,4)===ht?nt.count=Math.max(nt.count,zt.start+zt.count-nt.start):(++bt,H[bt]=zt)}H.length=bt+1;const ct=n.getParameter(n.UNPACK_ROW_LENGTH),It=n.getParameter(n.UNPACK_SKIP_PIXELS),vt=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,x.width);for(let Z=0,nt=H.length;Z<nt;Z++){const zt=H[Z],Ft=Math.floor(zt.start/4),ht=Math.ceil(zt.count/4),Ht=Ft%x.width,R=Math.floor(Ft/x.width),lt=ht,rt=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ht),n.pixelStorei(n.UNPACK_SKIP_ROWS,R),e.texSubImage2D(n.TEXTURE_2D,0,Ht,R,lt,rt,N,q,x.data)}M.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,ct),n.pixelStorei(n.UNPACK_SKIP_PIXELS,It),n.pixelStorei(n.UNPACK_SKIP_ROWS,vt)}}function Y(M,x,N){let q=n.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(q=n.TEXTURE_2D_ARRAY),x.isData3DTexture&&(q=n.TEXTURE_3D);const J=ve(M,x),H=x.source;e.bindTexture(q,M.__webglTexture,n.TEXTURE0+N);const bt=i.get(H);if(H.version!==bt.__version||J===!0){e.activeTexture(n.TEXTURE0+N);const ct=ue.getPrimaries(ue.workingColorSpace),It=x.colorSpace===mr?null:ue.getPrimaries(x.colorSpace),vt=x.colorSpace===mr||ct===It?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);let Z=_(x.image,!1,r.maxTextureSize);Z=wt(x,Z);const nt=s.convert(x.format,x.colorSpace),zt=s.convert(x.type);let Ft=S(x.internalFormat,nt,zt,x.colorSpace,x.isVideoTexture);ae(q,x);let ht;const Ht=x.mipmaps,R=x.isVideoTexture!==!0,lt=bt.__version===void 0||J===!0,rt=H.dataReady,st=I(x,Z);if(x.isDepthTexture)Ft=w(x.format===Oo,x.type),lt&&(R?e.texStorage2D(n.TEXTURE_2D,1,Ft,Z.width,Z.height):e.texImage2D(n.TEXTURE_2D,0,Ft,Z.width,Z.height,0,nt,zt,null));else if(x.isDataTexture)if(Ht.length>0){R&&lt&&e.texStorage2D(n.TEXTURE_2D,st,Ft,Ht[0].width,Ht[0].height);for(let tt=0,j=Ht.length;tt<j;tt++)ht=Ht[tt],R?rt&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,ht.width,ht.height,nt,zt,ht.data):e.texImage2D(n.TEXTURE_2D,tt,Ft,ht.width,ht.height,0,nt,zt,ht.data);x.generateMipmaps=!1}else R?(lt&&e.texStorage2D(n.TEXTURE_2D,st,Ft,Z.width,Z.height),rt&&Ce(x,Z,nt,zt)):e.texImage2D(n.TEXTURE_2D,0,Ft,Z.width,Z.height,0,nt,zt,Z.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){R&&lt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,st,Ft,Ht[0].width,Ht[0].height,Z.depth);for(let tt=0,j=Ht.length;tt<j;tt++)if(ht=Ht[tt],x.format!==hi)if(nt!==null)if(R){if(rt)if(x.layerUpdates.size>0){const gt=nf(ht.width,ht.height,x.format,x.type);for(const Xt of x.layerUpdates){const Pe=ht.data.subarray(Xt*gt/ht.data.BYTES_PER_ELEMENT,(Xt+1)*gt/ht.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,Xt,ht.width,ht.height,1,nt,Pe)}x.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,0,ht.width,ht.height,Z.depth,nt,ht.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,tt,Ft,ht.width,ht.height,Z.depth,0,ht.data,0,0);else Gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else R?rt&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,0,ht.width,ht.height,Z.depth,nt,zt,ht.data):e.texImage3D(n.TEXTURE_2D_ARRAY,tt,Ft,ht.width,ht.height,Z.depth,0,nt,zt,ht.data)}else{R&&lt&&e.texStorage2D(n.TEXTURE_2D,st,Ft,Ht[0].width,Ht[0].height);for(let tt=0,j=Ht.length;tt<j;tt++)ht=Ht[tt],x.format!==hi?nt!==null?R?rt&&e.compressedTexSubImage2D(n.TEXTURE_2D,tt,0,0,ht.width,ht.height,nt,ht.data):e.compressedTexImage2D(n.TEXTURE_2D,tt,Ft,ht.width,ht.height,0,ht.data):Gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):R?rt&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,ht.width,ht.height,nt,zt,ht.data):e.texImage2D(n.TEXTURE_2D,tt,Ft,ht.width,ht.height,0,nt,zt,ht.data)}else if(x.isDataArrayTexture)if(R){if(lt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,st,Ft,Z.width,Z.height,Z.depth),rt)if(x.layerUpdates.size>0){const tt=nf(Z.width,Z.height,x.format,x.type);for(const j of x.layerUpdates){const gt=Z.data.subarray(j*tt/Z.data.BYTES_PER_ELEMENT,(j+1)*tt/Z.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,j,Z.width,Z.height,1,nt,zt,gt)}x.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,nt,zt,Z.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,Ft,Z.width,Z.height,Z.depth,0,nt,zt,Z.data);else if(x.isData3DTexture)R?(lt&&e.texStorage3D(n.TEXTURE_3D,st,Ft,Z.width,Z.height,Z.depth),rt&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,nt,zt,Z.data)):e.texImage3D(n.TEXTURE_3D,0,Ft,Z.width,Z.height,Z.depth,0,nt,zt,Z.data);else if(x.isFramebufferTexture){if(lt)if(R)e.texStorage2D(n.TEXTURE_2D,st,Ft,Z.width,Z.height);else{let tt=Z.width,j=Z.height;for(let gt=0;gt<st;gt++)e.texImage2D(n.TEXTURE_2D,gt,Ft,tt,j,0,nt,zt,null),tt>>=1,j>>=1}}else if(Ht.length>0){if(R&&lt){const tt=qt(Ht[0]);e.texStorage2D(n.TEXTURE_2D,st,Ft,tt.width,tt.height)}for(let tt=0,j=Ht.length;tt<j;tt++)ht=Ht[tt],R?rt&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,nt,zt,ht):e.texImage2D(n.TEXTURE_2D,tt,Ft,nt,zt,ht);x.generateMipmaps=!1}else if(R){if(lt){const tt=qt(Z);e.texStorage2D(n.TEXTURE_2D,st,Ft,tt.width,tt.height)}rt&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,nt,zt,Z)}else e.texImage2D(n.TEXTURE_2D,0,Ft,nt,zt,Z);m(x)&&p(q),bt.__version=H.version,x.onUpdate&&x.onUpdate(x)}M.__version=x.version}function K(M,x,N){if(x.image.length!==6)return;const q=ve(M,x),J=x.source;e.bindTexture(n.TEXTURE_CUBE_MAP,M.__webglTexture,n.TEXTURE0+N);const H=i.get(J);if(J.version!==H.__version||q===!0){e.activeTexture(n.TEXTURE0+N);const bt=ue.getPrimaries(ue.workingColorSpace),ct=x.colorSpace===mr?null:ue.getPrimaries(x.colorSpace),It=x.colorSpace===mr||bt===ct?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,It);const vt=x.isCompressedTexture||x.image[0].isCompressedTexture,Z=x.image[0]&&x.image[0].isDataTexture,nt=[];for(let j=0;j<6;j++)!vt&&!Z?nt[j]=_(x.image[j],!0,r.maxCubemapSize):nt[j]=Z?x.image[j].image:x.image[j],nt[j]=wt(x,nt[j]);const zt=nt[0],Ft=s.convert(x.format,x.colorSpace),ht=s.convert(x.type),Ht=S(x.internalFormat,Ft,ht,x.colorSpace),R=x.isVideoTexture!==!0,lt=H.__version===void 0||q===!0,rt=J.dataReady;let st=I(x,zt);ae(n.TEXTURE_CUBE_MAP,x);let tt;if(vt){R&&lt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,st,Ht,zt.width,zt.height);for(let j=0;j<6;j++){tt=nt[j].mipmaps;for(let gt=0;gt<tt.length;gt++){const Xt=tt[gt];x.format!==hi?Ft!==null?R?rt&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,gt,0,0,Xt.width,Xt.height,Ft,Xt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,gt,Ht,Xt.width,Xt.height,0,Xt.data):Gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):R?rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,gt,0,0,Xt.width,Xt.height,Ft,ht,Xt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,gt,Ht,Xt.width,Xt.height,0,Ft,ht,Xt.data)}}}else{if(tt=x.mipmaps,R&&lt){tt.length>0&&st++;const j=qt(nt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,st,Ht,j.width,j.height)}for(let j=0;j<6;j++)if(Z){R?rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,nt[j].width,nt[j].height,Ft,ht,nt[j].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Ht,nt[j].width,nt[j].height,0,Ft,ht,nt[j].data);for(let gt=0;gt<tt.length;gt++){const Pe=tt[gt].image[j].image;R?rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,gt+1,0,0,Pe.width,Pe.height,Ft,ht,Pe.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,gt+1,Ht,Pe.width,Pe.height,0,Ft,ht,Pe.data)}}else{R?rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Ft,ht,nt[j]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Ht,Ft,ht,nt[j]);for(let gt=0;gt<tt.length;gt++){const Xt=tt[gt];R?rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,gt+1,0,0,Ft,ht,Xt.image[j]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,gt+1,Ht,Ft,ht,Xt.image[j])}}}m(x)&&p(n.TEXTURE_CUBE_MAP),H.__version=J.version,x.onUpdate&&x.onUpdate(x)}M.__version=x.version}function pt(M,x,N,q,J,H){const bt=s.convert(N.format,N.colorSpace),ct=s.convert(N.type),It=S(N.internalFormat,bt,ct,N.colorSpace),vt=i.get(x),Z=i.get(N);if(Z.__renderTarget=x,!vt.__hasExternalTextures){const nt=Math.max(1,x.width>>H),zt=Math.max(1,x.height>>H);J===n.TEXTURE_3D||J===n.TEXTURE_2D_ARRAY?e.texImage3D(J,H,It,nt,zt,x.depth,0,bt,ct,null):e.texImage2D(J,H,It,nt,zt,0,bt,ct,null)}e.bindFramebuffer(n.FRAMEBUFFER,M),_t(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,q,J,Z.__webglTexture,0,Re(x)):(J===n.TEXTURE_2D||J>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,q,J,Z.__webglTexture,H),e.bindFramebuffer(n.FRAMEBUFFER,null)}function Yt(M,x,N){if(n.bindRenderbuffer(n.RENDERBUFFER,M),x.depthBuffer){const q=x.depthTexture,J=q&&q.isDepthTexture?q.type:null,H=w(x.stencilBuffer,J),bt=x.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ct=Re(x);_t(x)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ct,H,x.width,x.height):N?n.renderbufferStorageMultisample(n.RENDERBUFFER,ct,H,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,H,x.width,x.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,bt,n.RENDERBUFFER,M)}else{const q=x.textures;for(let J=0;J<q.length;J++){const H=q[J],bt=s.convert(H.format,H.colorSpace),ct=s.convert(H.type),It=S(H.internalFormat,bt,ct,H.colorSpace),vt=Re(x);N&&_t(x)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,vt,It,x.width,x.height):_t(x)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,vt,It,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,It,x.width,x.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function St(M,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,M),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const q=i.get(x.depthTexture);q.__renderTarget=x,(!q.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),W(x.depthTexture,0);const J=q.__webglTexture,H=Re(x);if(x.depthTexture.format===Bo)_t(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,J,0,H):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,J,0);else if(x.depthTexture.format===Oo)_t(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,J,0,H):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function ie(M){const x=i.get(M),N=M.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==M.depthTexture){const q=M.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),q){const J=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,q.removeEventListener("dispose",J)};q.addEventListener("dispose",J),x.__depthDisposeCallback=J}x.__boundDepthTexture=q}if(M.depthTexture&&!x.__autoAllocateDepthBuffer){if(N)throw new Error("target.depthTexture not supported in Cube render targets");const q=M.texture.mipmaps;q&&q.length>0?St(x.__webglFramebuffer[0],M):St(x.__webglFramebuffer,M)}else if(N){x.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(e.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[q]),x.__webglDepthbuffer[q]===void 0)x.__webglDepthbuffer[q]=n.createRenderbuffer(),Yt(x.__webglDepthbuffer[q],M,!1);else{const J=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,H=x.__webglDepthbuffer[q];n.bindRenderbuffer(n.RENDERBUFFER,H),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,H)}}else{const q=M.texture.mipmaps;if(q&&q.length>0?e.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=n.createRenderbuffer(),Yt(x.__webglDepthbuffer,M,!1);else{const J=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,H=x.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,H),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,H)}}e.bindFramebuffer(n.FRAMEBUFFER,null)}function nn(M,x,N){const q=i.get(M);x!==void 0&&pt(q.__webglFramebuffer,M,M.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),N!==void 0&&ie(M)}function ne(M){const x=M.texture,N=i.get(M),q=i.get(x);M.addEventListener("dispose",D);const J=M.textures,H=M.isWebGLCubeRenderTarget===!0,bt=J.length>1;if(bt||(q.__webglTexture===void 0&&(q.__webglTexture=n.createTexture()),q.__version=x.version,o.memory.textures++),H){N.__webglFramebuffer=[];for(let ct=0;ct<6;ct++)if(x.mipmaps&&x.mipmaps.length>0){N.__webglFramebuffer[ct]=[];for(let It=0;It<x.mipmaps.length;It++)N.__webglFramebuffer[ct][It]=n.createFramebuffer()}else N.__webglFramebuffer[ct]=n.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){N.__webglFramebuffer=[];for(let ct=0;ct<x.mipmaps.length;ct++)N.__webglFramebuffer[ct]=n.createFramebuffer()}else N.__webglFramebuffer=n.createFramebuffer();if(bt)for(let ct=0,It=J.length;ct<It;ct++){const vt=i.get(J[ct]);vt.__webglTexture===void 0&&(vt.__webglTexture=n.createTexture(),o.memory.textures++)}if(M.samples>0&&_t(M)===!1){N.__webglMultisampledFramebuffer=n.createFramebuffer(),N.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let ct=0;ct<J.length;ct++){const It=J[ct];N.__webglColorRenderbuffer[ct]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,N.__webglColorRenderbuffer[ct]);const vt=s.convert(It.format,It.colorSpace),Z=s.convert(It.type),nt=S(It.internalFormat,vt,Z,It.colorSpace,M.isXRRenderTarget===!0),zt=Re(M);n.renderbufferStorageMultisample(n.RENDERBUFFER,zt,nt,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ct,n.RENDERBUFFER,N.__webglColorRenderbuffer[ct])}n.bindRenderbuffer(n.RENDERBUFFER,null),M.depthBuffer&&(N.__webglDepthRenderbuffer=n.createRenderbuffer(),Yt(N.__webglDepthRenderbuffer,M,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(H){e.bindTexture(n.TEXTURE_CUBE_MAP,q.__webglTexture),ae(n.TEXTURE_CUBE_MAP,x);for(let ct=0;ct<6;ct++)if(x.mipmaps&&x.mipmaps.length>0)for(let It=0;It<x.mipmaps.length;It++)pt(N.__webglFramebuffer[ct][It],M,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,It);else pt(N.__webglFramebuffer[ct],M,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0);m(x)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(bt){for(let ct=0,It=J.length;ct<It;ct++){const vt=J[ct],Z=i.get(vt);let nt=n.TEXTURE_2D;(M.isWebGL3DRenderTarget||M.isWebGLArrayRenderTarget)&&(nt=M.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(nt,Z.__webglTexture),ae(nt,vt),pt(N.__webglFramebuffer,M,vt,n.COLOR_ATTACHMENT0+ct,nt,0),m(vt)&&p(nt)}e.unbindTexture()}else{let ct=n.TEXTURE_2D;if((M.isWebGL3DRenderTarget||M.isWebGLArrayRenderTarget)&&(ct=M.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(ct,q.__webglTexture),ae(ct,x),x.mipmaps&&x.mipmaps.length>0)for(let It=0;It<x.mipmaps.length;It++)pt(N.__webglFramebuffer[It],M,x,n.COLOR_ATTACHMENT0,ct,It);else pt(N.__webglFramebuffer,M,x,n.COLOR_ATTACHMENT0,ct,0);m(x)&&p(ct),e.unbindTexture()}M.depthBuffer&&ie(M)}function Fe(M){const x=M.textures;for(let N=0,q=x.length;N<q;N++){const J=x[N];if(m(J)){const H=A(M),bt=i.get(J).__webglTexture;e.bindTexture(H,bt),p(H),e.unbindTexture()}}}const C=[],re=[];function se(M){if(M.samples>0){if(_t(M)===!1){const x=M.textures,N=M.width,q=M.height;let J=n.COLOR_BUFFER_BIT;const H=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,bt=i.get(M),ct=x.length>1;if(ct)for(let vt=0;vt<x.length;vt++)e.bindFramebuffer(n.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+vt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,bt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+vt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,bt.__webglMultisampledFramebuffer);const It=M.texture.mipmaps;It&&It.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,bt.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,bt.__webglFramebuffer);for(let vt=0;vt<x.length;vt++){if(M.resolveDepthBuffer&&(M.depthBuffer&&(J|=n.DEPTH_BUFFER_BIT),M.stencilBuffer&&M.resolveStencilBuffer&&(J|=n.STENCIL_BUFFER_BIT)),ct){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,bt.__webglColorRenderbuffer[vt]);const Z=i.get(x[vt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Z,0)}n.blitFramebuffer(0,0,N,q,0,0,N,q,J,n.NEAREST),c===!0&&(C.length=0,re.length=0,C.push(n.COLOR_ATTACHMENT0+vt),M.depthBuffer&&M.resolveDepthBuffer===!1&&(C.push(H),re.push(H),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,re)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,C))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ct)for(let vt=0;vt<x.length;vt++){e.bindFramebuffer(n.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+vt,n.RENDERBUFFER,bt.__webglColorRenderbuffer[vt]);const Z=i.get(x[vt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,bt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+vt,n.TEXTURE_2D,Z,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,bt.__webglMultisampledFramebuffer)}else if(M.depthBuffer&&M.resolveDepthBuffer===!1&&c){const x=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[x])}}}function Re(M){return Math.min(r.maxSamples,M.samples)}function _t(M){const x=i.get(M);return M.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function Oe(M){const x=o.render.frame;u.get(M)!==x&&(u.set(M,x),M.update())}function wt(M,x){const N=M.colorSpace,q=M.format,J=M.type;return M.isCompressedTexture===!0||M.isVideoTexture===!0||N!==Hs&&N!==mr&&(ue.getTransfer(N)===Se?(q!==hi||J!==Li)&&Gt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):qe("WebGLTextures: Unsupported texture color space:",N)),x}function qt(M){return typeof HTMLImageElement<"u"&&M instanceof HTMLImageElement?(l.width=M.naturalWidth||M.width,l.height=M.naturalHeight||M.height):typeof VideoFrame<"u"&&M instanceof VideoFrame?(l.width=M.displayWidth,l.height=M.displayHeight):(l.width=M.width,l.height=M.height),l}this.allocateTextureUnit=k,this.resetTextureUnits=B,this.setTexture2D=W,this.setTexture2DArray=$,this.setTexture3D=Q,this.setTextureCube=G,this.rebindTextures=nn,this.setupRenderTarget=ne,this.updateRenderTargetMipmap=Fe,this.updateMultisampleRenderTarget=se,this.setupDepthRenderbuffer=ie,this.setupFrameBufferTexture=pt,this.useMultisampledRTT=_t}function $w(n,t){function e(i,r=mr){let s;const o=ue.getTransfer(r);if(i===Li)return n.UNSIGNED_BYTE;if(i===oh)return n.UNSIGNED_SHORT_4_4_4_4;if(i===ah)return n.UNSIGNED_SHORT_5_5_5_1;if(i===q0)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Y0)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===W0)return n.BYTE;if(i===X0)return n.SHORT;if(i===Fo)return n.UNSIGNED_SHORT;if(i===sh)return n.INT;if(i===Hr)return n.UNSIGNED_INT;if(i===Ci)return n.FLOAT;if(i===js)return n.HALF_FLOAT;if(i===$0)return n.ALPHA;if(i===j0)return n.RGB;if(i===hi)return n.RGBA;if(i===Bo)return n.DEPTH_COMPONENT;if(i===Oo)return n.DEPTH_STENCIL;if(i===ch)return n.RED;if(i===lh)return n.RED_INTEGER;if(i===uh)return n.RG;if(i===hh)return n.RG_INTEGER;if(i===dh)return n.RGBA_INTEGER;if(i===za||i===Va||i===ka||i===Ha)if(o===Se)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===za)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Va)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ka)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ha)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===za)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Va)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ka)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ha)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===iu||i===ru||i===su||i===ou)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===iu)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===ru)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===su)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ou)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===au||i===cu||i===lu)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===au||i===cu)return o===Se?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===lu)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===uu||i===hu||i===du||i===fu||i===pu||i===mu||i===gu||i===xu||i===_u||i===vu||i===yu||i===bu||i===Su||i===Mu)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===uu)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===hu)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===du)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===fu)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===pu)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===mu)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===gu)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===xu)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===_u)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===vu)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===yu)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===bu)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Su)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Mu)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===wu||i===Au||i===Eu)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===wu)return o===Se?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Au)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Eu)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Tu||i===Cu||i===Ru||i===Iu)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===Tu)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Cu)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ru)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Iu)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===No?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}const jw=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Jw=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Kw{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const i=new hm(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new er({vertexShader:jw,fragmentShader:Jw,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new mt(new an(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Zw extends Js{constructor(t,e){super();const i=this;let r=null,s=1,o=null,a="local-floor",c=1,l=null,u=null,h=null,d=null,f=null,g=null;const _=typeof XRWebGLBinding<"u",m=new Kw,p={},A=e.getContextAttributes();let S=null,w=null;const I=[],E=[],D=new ft;let O=null;const b=new Zn;b.viewport=new Xe;const y=new Zn;y.viewport=new Xe;const L=[b,y],B=new gb;let k=null,X=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let K=I[Y];return K===void 0&&(K=new vl,I[Y]=K),K.getTargetRaySpace()},this.getControllerGrip=function(Y){let K=I[Y];return K===void 0&&(K=new vl,I[Y]=K),K.getGripSpace()},this.getHand=function(Y){let K=I[Y];return K===void 0&&(K=new vl,I[Y]=K),K.getHandSpace()};function W(Y){const K=E.indexOf(Y.inputSource);if(K===-1)return;const pt=I[K];pt!==void 0&&(pt.update(Y.inputSource,Y.frame,l||o),pt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function $(){r.removeEventListener("select",W),r.removeEventListener("selectstart",W),r.removeEventListener("selectend",W),r.removeEventListener("squeeze",W),r.removeEventListener("squeezestart",W),r.removeEventListener("squeezeend",W),r.removeEventListener("end",$),r.removeEventListener("inputsourceschange",Q);for(let Y=0;Y<I.length;Y++){const K=E[Y];K!==null&&(E[Y]=null,I[Y].disconnect(K))}k=null,X=null,m.reset();for(const Y in p)delete p[Y];t.setRenderTarget(S),f=null,d=null,h=null,r=null,w=null,Ce.stop(),i.isPresenting=!1,t.setPixelRatio(O),t.setSize(D.width,D.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,i.isPresenting===!0&&Gt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,i.isPresenting===!0&&Gt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&_&&(h=new XRWebGLBinding(r,e)),h},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(Y){if(r=Y,r!==null){if(S=t.getRenderTarget(),r.addEventListener("select",W),r.addEventListener("selectstart",W),r.addEventListener("selectend",W),r.addEventListener("squeeze",W),r.addEventListener("squeezestart",W),r.addEventListener("squeezeend",W),r.addEventListener("end",$),r.addEventListener("inputsourceschange",Q),A.xrCompatible!==!0&&await e.makeXRCompatible(),O=t.getPixelRatio(),t.getSize(D),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let pt=null,Yt=null,St=null;A.depth&&(St=A.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,pt=A.stencil?Oo:Bo,Yt=A.stencil?No:Hr);const ie={colorFormat:e.RGBA8,depthFormat:St,scaleFactor:s};h=this.getBinding(),d=h.createProjectionLayer(ie),r.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),w=new Gr(d.textureWidth,d.textureHeight,{format:hi,type:Li,depthTexture:new um(d.textureWidth,d.textureHeight,Yt,void 0,void 0,void 0,void 0,void 0,void 0,pt),stencilBuffer:A.stencil,colorSpace:t.outputColorSpace,samples:A.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const pt={antialias:A.antialias,alpha:!0,depth:A.depth,stencil:A.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,e,pt),r.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),w=new Gr(f.framebufferWidth,f.framebufferHeight,{format:hi,type:Li,colorSpace:t.outputColorSpace,stencilBuffer:A.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await r.requestReferenceSpace(a),Ce.setContext(r),Ce.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Q(Y){for(let K=0;K<Y.removed.length;K++){const pt=Y.removed[K],Yt=E.indexOf(pt);Yt>=0&&(E[Yt]=null,I[Yt].disconnect(pt))}for(let K=0;K<Y.added.length;K++){const pt=Y.added[K];let Yt=E.indexOf(pt);if(Yt===-1){for(let ie=0;ie<I.length;ie++)if(ie>=E.length){E.push(pt),Yt=ie;break}else if(E[ie]===null){E[ie]=pt,Yt=ie;break}if(Yt===-1)break}const St=I[Yt];St&&St.connect(pt)}}const G=new T,it=new T;function ot(Y,K,pt){G.setFromMatrixPosition(K.matrixWorld),it.setFromMatrixPosition(pt.matrixWorld);const Yt=G.distanceTo(it),St=K.projectionMatrix.elements,ie=pt.projectionMatrix.elements,nn=St[14]/(St[10]-1),ne=St[14]/(St[10]+1),Fe=(St[9]+1)/St[5],C=(St[9]-1)/St[5],re=(St[8]-1)/St[0],se=(ie[8]+1)/ie[0],Re=nn*re,_t=nn*se,Oe=Yt/(-re+se),wt=Oe*-re;if(K.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(wt),Y.translateZ(Oe),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),St[10]===-1)Y.projectionMatrix.copy(K.projectionMatrix),Y.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const qt=nn+Oe,M=ne+Oe,x=Re-wt,N=_t+(Yt-wt),q=Fe*ne/M*qt,J=C*ne/M*qt;Y.projectionMatrix.makePerspective(x,N,q,J,qt,M),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function Rt(Y,K){K===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(K.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(r===null)return;let K=Y.near,pt=Y.far;m.texture!==null&&(m.depthNear>0&&(K=m.depthNear),m.depthFar>0&&(pt=m.depthFar)),B.near=y.near=b.near=K,B.far=y.far=b.far=pt,(k!==B.near||X!==B.far)&&(r.updateRenderState({depthNear:B.near,depthFar:B.far}),k=B.near,X=B.far),B.layers.mask=Y.layers.mask|6,b.layers.mask=B.layers.mask&3,y.layers.mask=B.layers.mask&5;const Yt=Y.parent,St=B.cameras;Rt(B,Yt);for(let ie=0;ie<St.length;ie++)Rt(St[ie],Yt);St.length===2?ot(B,b,y):B.projectionMatrix.copy(b.projectionMatrix),ae(Y,B,Yt)};function ae(Y,K,pt){pt===null?Y.matrix.copy(K.matrixWorld):(Y.matrix.copy(pt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(K.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(K.projectionMatrix),Y.projectionMatrixInverse.copy(K.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Vo*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(Y){c=Y,d!==null&&(d.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(B)},this.getCameraTexture=function(Y){return p[Y]};let ve=null;function Te(Y,K){if(u=K.getViewerPose(l||o),g=K,u!==null){const pt=u.views;f!==null&&(t.setRenderTargetFramebuffer(w,f.framebuffer),t.setRenderTarget(w));let Yt=!1;pt.length!==B.cameras.length&&(B.cameras.length=0,Yt=!0);for(let ne=0;ne<pt.length;ne++){const Fe=pt[ne];let C=null;if(f!==null)C=f.getViewport(Fe);else{const se=h.getViewSubImage(d,Fe);C=se.viewport,ne===0&&(t.setRenderTargetTextures(w,se.colorTexture,se.depthStencilTexture),t.setRenderTarget(w))}let re=L[ne];re===void 0&&(re=new Zn,re.layers.enable(ne),re.viewport=new Xe,L[ne]=re),re.matrix.fromArray(Fe.transform.matrix),re.matrix.decompose(re.position,re.quaternion,re.scale),re.projectionMatrix.fromArray(Fe.projectionMatrix),re.projectionMatrixInverse.copy(re.projectionMatrix).invert(),re.viewport.set(C.x,C.y,C.width,C.height),ne===0&&(B.matrix.copy(re.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),Yt===!0&&B.cameras.push(re)}const St=r.enabledFeatures;if(St&&St.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&_){h=i.getBinding();const ne=h.getDepthInformation(pt[0]);ne&&ne.isValid&&ne.texture&&m.init(ne,r.renderState)}if(St&&St.includes("camera-access")&&_){t.state.unbindTexture(),h=i.getBinding();for(let ne=0;ne<pt.length;ne++){const Fe=pt[ne].camera;if(Fe){let C=p[Fe];C||(C=new hm,p[Fe]=C);const re=h.getCameraImage(Fe);C.sourceTexture=re}}}}for(let pt=0;pt<I.length;pt++){const Yt=E[pt],St=I[pt];Yt!==null&&St!==void 0&&St.update(Yt,K,l||o)}ve&&ve(Y,K),K.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:K}),g=null}const Ce=new Mm;Ce.setAnimationLoop(Te),this.setAnimationLoop=function(Y){ve=Y},this.dispose=function(){}}}const Lr=new Pi,Qw=new De;function t3(n,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,sm(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,A,S,w){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),h(m,p)):p.isMeshPhongMaterial?(s(m,p),u(m,p)):p.isMeshStandardMaterial?(s(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,w)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),_(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,A,S):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Mn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Mn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const A=t.get(p),S=A.envMap,w=A.envMapRotation;S&&(m.envMap.value=S,Lr.copy(w),Lr.x*=-1,Lr.y*=-1,Lr.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Lr.y*=-1,Lr.z*=-1),m.envMapRotation.value.setFromMatrix4(Qw.makeRotationFromEuler(Lr)),m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,A,S){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*A,m.scale.value=S*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function h(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,A){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Mn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=A.texture,m.transmissionSamplerSize.value.set(A.width,A.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const A=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(A.matrixWorld),m.nearDistance.value=A.shadow.camera.near,m.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function e3(n,t,e,i){let r={},s={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(A,S){const w=S.program;i.uniformBlockBinding(A,w)}function l(A,S){let w=r[A.id];w===void 0&&(g(A),w=u(A),r[A.id]=w,A.addEventListener("dispose",m));const I=S.program;i.updateUBOMapping(A,I);const E=t.render.frame;s[A.id]!==E&&(d(A),s[A.id]=E)}function u(A){const S=h();A.__bindingPointIndex=S;const w=n.createBuffer(),I=A.__size,E=A.usage;return n.bindBuffer(n.UNIFORM_BUFFER,w),n.bufferData(n.UNIFORM_BUFFER,I,E),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,S,w),w}function h(){for(let A=0;A<a;A++)if(o.indexOf(A)===-1)return o.push(A),A;return qe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(A){const S=r[A.id],w=A.uniforms,I=A.__cache;n.bindBuffer(n.UNIFORM_BUFFER,S);for(let E=0,D=w.length;E<D;E++){const O=Array.isArray(w[E])?w[E]:[w[E]];for(let b=0,y=O.length;b<y;b++){const L=O[b];if(f(L,E,b,I)===!0){const B=L.__offset,k=Array.isArray(L.value)?L.value:[L.value];let X=0;for(let W=0;W<k.length;W++){const $=k[W],Q=_($);typeof $=="number"||typeof $=="boolean"?(L.__data[0]=$,n.bufferSubData(n.UNIFORM_BUFFER,B+X,L.__data)):$.isMatrix3?(L.__data[0]=$.elements[0],L.__data[1]=$.elements[1],L.__data[2]=$.elements[2],L.__data[3]=0,L.__data[4]=$.elements[3],L.__data[5]=$.elements[4],L.__data[6]=$.elements[5],L.__data[7]=0,L.__data[8]=$.elements[6],L.__data[9]=$.elements[7],L.__data[10]=$.elements[8],L.__data[11]=0):($.toArray(L.__data,X),X+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,B,L.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(A,S,w,I){const E=A.value,D=S+"_"+w;if(I[D]===void 0)return typeof E=="number"||typeof E=="boolean"?I[D]=E:I[D]=E.clone(),!0;{const O=I[D];if(typeof E=="number"||typeof E=="boolean"){if(O!==E)return I[D]=E,!0}else if(O.equals(E)===!1)return O.copy(E),!0}return!1}function g(A){const S=A.uniforms;let w=0;const I=16;for(let D=0,O=S.length;D<O;D++){const b=Array.isArray(S[D])?S[D]:[S[D]];for(let y=0,L=b.length;y<L;y++){const B=b[y],k=Array.isArray(B.value)?B.value:[B.value];for(let X=0,W=k.length;X<W;X++){const $=k[X],Q=_($),G=w%I,it=G%Q.boundary,ot=G+it;w+=it,ot!==0&&I-ot<Q.storage&&(w+=I-ot),B.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=w,w+=Q.storage}}}const E=w%I;return E>0&&(w+=I-E),A.__size=w,A.__cache={},this}function _(A){const S={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(S.boundary=4,S.storage=4):A.isVector2?(S.boundary=8,S.storage=8):A.isVector3||A.isColor?(S.boundary=16,S.storage=12):A.isVector4?(S.boundary=16,S.storage=16):A.isMatrix3?(S.boundary=48,S.storage=48):A.isMatrix4?(S.boundary=64,S.storage=64):A.isTexture?Gt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Gt("WebGLRenderer: Unsupported uniform value type.",A),S}function m(A){const S=A.target;S.removeEventListener("dispose",m);const w=o.indexOf(S.__bindingPointIndex);o.splice(w,1),n.deleteBuffer(r[S.id]),delete r[S.id],delete s[S.id]}function p(){for(const A in r)n.deleteBuffer(r[A]);o=[],r={},s={}}return{bind:c,update:l,dispose:p}}const n3=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let Vi=null;function i3(){return Vi===null&&(Vi=new cm(n3,32,32,uh,js),Vi.minFilter=Qn,Vi.magFilter=Qn,Vi.wrapS=ji,Vi.wrapT=ji,Vi.generateMipmaps=!1,Vi.needsUpdate=!0),Vi}class r3{constructor(t={}){const{canvas:e=Ov(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;const g=new Set([dh,hh,lh]),_=new Set([Li,Hr,Fo,No,oh,ah]),m=new Uint32Array(4),p=new Int32Array(4);let A=null,S=null;const w=[],I=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=xr,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const E=this;let D=!1;this._outputColorSpace=Rn;let O=0,b=0,y=null,L=-1,B=null;const k=new Xe,X=new Xe;let W=null;const $=new Zt(0);let Q=0,G=e.width,it=e.height,ot=1,Rt=null,ae=null;const ve=new Xe(0,0,G,it),Te=new Xe(0,0,G,it);let Ce=!1;const Y=new gh;let K=!1,pt=!1;const Yt=new De,St=new T,ie=new Xe,nn={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ne=!1;function Fe(){return y===null?ot:1}let C=i;function re(v,U){return e.getContext(v,U)}try{const v={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${rh}`),e.addEventListener("webglcontextlost",tt,!1),e.addEventListener("webglcontextrestored",j,!1),e.addEventListener("webglcontextcreationerror",gt,!1),C===null){const U="webgl2";if(C=re(U,v),C===null)throw re(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(v){throw v("WebGLRenderer: "+v.message),v}let se,Re,_t,Oe,wt,qt,M,x,N,q,J,H,bt,ct,It,vt,Z,nt,zt,Ft,ht,Ht,R,lt;function rt(){se=new d1(C),se.init(),Ht=new $w(C,se),Re=new i1(C,se,t,Ht),_t=new qw(C,se),Re.reversedDepthBuffer&&d&&_t.buffers.depth.setReversed(!0),Oe=new m1(C),wt=new Pw,qt=new Yw(C,se,_t,wt,Re,Ht,Oe),M=new s1(E),x=new h1(E),N=new vb(C),R=new e1(C,N),q=new f1(C,N,Oe,R),J=new x1(C,q,N,Oe),zt=new g1(C,Re,qt),vt=new r1(wt),H=new Lw(E,M,x,se,Re,R,vt),bt=new t3(E,wt),ct=new Fw,It=new kw(se),nt=new t1(E,M,x,_t,J,f,c),Z=new Ww(E,J,Re),lt=new e3(C,Oe,Re,_t),Ft=new n1(C,se,Oe),ht=new p1(C,se,Oe),Oe.programs=H.programs,E.capabilities=Re,E.extensions=se,E.properties=wt,E.renderLists=ct,E.shadowMap=Z,E.state=_t,E.info=Oe}rt();const st=new Zw(E,C);this.xr=st,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){const v=se.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){const v=se.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return ot},this.setPixelRatio=function(v){v!==void 0&&(ot=v,this.setSize(G,it,!1))},this.getSize=function(v){return v.set(G,it)},this.setSize=function(v,U,z=!0){if(st.isPresenting){Gt("WebGLRenderer: Can't change size while VR device is presenting.");return}G=v,it=U,e.width=Math.floor(v*ot),e.height=Math.floor(U*ot),z===!0&&(e.style.width=v+"px",e.style.height=U+"px"),this.setViewport(0,0,v,U)},this.getDrawingBufferSize=function(v){return v.set(G*ot,it*ot).floor()},this.setDrawingBufferSize=function(v,U,z){G=v,it=U,ot=z,e.width=Math.floor(v*z),e.height=Math.floor(U*z),this.setViewport(0,0,v,U)},this.getCurrentViewport=function(v){return v.copy(k)},this.getViewport=function(v){return v.copy(ve)},this.setViewport=function(v,U,z,V){v.isVector4?ve.set(v.x,v.y,v.z,v.w):ve.set(v,U,z,V),_t.viewport(k.copy(ve).multiplyScalar(ot).round())},this.getScissor=function(v){return v.copy(Te)},this.setScissor=function(v,U,z,V){v.isVector4?Te.set(v.x,v.y,v.z,v.w):Te.set(v,U,z,V),_t.scissor(X.copy(Te).multiplyScalar(ot).round())},this.getScissorTest=function(){return Ce},this.setScissorTest=function(v){_t.setScissorTest(Ce=v)},this.setOpaqueSort=function(v){Rt=v},this.setTransparentSort=function(v){ae=v},this.getClearColor=function(v){return v.copy(nt.getClearColor())},this.setClearColor=function(){nt.setClearColor(...arguments)},this.getClearAlpha=function(){return nt.getClearAlpha()},this.setClearAlpha=function(){nt.setClearAlpha(...arguments)},this.clear=function(v=!0,U=!0,z=!0){let V=0;if(v){let F=!1;if(y!==null){const et=y.texture.format;F=g.has(et)}if(F){const et=y.texture.type,ut=_.has(et),xt=nt.getClearColor(),dt=nt.getClearAlpha(),Ot=xt.r,kt=xt.g,Mt=xt.b;ut?(m[0]=Ot,m[1]=kt,m[2]=Mt,m[3]=dt,C.clearBufferuiv(C.COLOR,0,m)):(p[0]=Ot,p[1]=kt,p[2]=Mt,p[3]=dt,C.clearBufferiv(C.COLOR,0,p))}else V|=C.COLOR_BUFFER_BIT}U&&(V|=C.DEPTH_BUFFER_BIT),z&&(V|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),C.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",tt,!1),e.removeEventListener("webglcontextrestored",j,!1),e.removeEventListener("webglcontextcreationerror",gt,!1),nt.dispose(),ct.dispose(),It.dispose(),wt.dispose(),M.dispose(),x.dispose(),J.dispose(),R.dispose(),lt.dispose(),H.dispose(),st.dispose(),st.removeEventListener("sessionstart",Ih),st.removeEventListener("sessionend",Dh),wr.stop()};function tt(v){v.preventDefault(),Sd("WebGLRenderer: Context Lost."),D=!0}function j(){Sd("WebGLRenderer: Context Restored."),D=!1;const v=Oe.autoReset,U=Z.enabled,z=Z.autoUpdate,V=Z.needsUpdate,F=Z.type;rt(),Oe.autoReset=v,Z.enabled=U,Z.autoUpdate=z,Z.needsUpdate=V,Z.type=F}function gt(v){qe("WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function Xt(v){const U=v.target;U.removeEventListener("dispose",Xt),Pe(U)}function Pe(v){ye(v),wt.remove(v)}function ye(v){const U=wt.get(v).programs;U!==void 0&&(U.forEach(function(z){H.releaseProgram(z)}),v.isShaderMaterial&&H.releaseShaderCache(v))}this.renderBufferDirect=function(v,U,z,V,F,et){U===null&&(U=nn);const ut=F.isMesh&&F.matrixWorld.determinant()<0,xt=ug(v,U,z,V,F);_t.setMaterial(V,ut);let dt=z.index,Ot=1;if(V.wireframe===!0){if(dt=q.getWireframeAttribute(z),dt===void 0)return;Ot=2}const kt=z.drawRange,Mt=z.attributes.position;let oe=kt.start*Ot,be=(kt.start+kt.count)*Ot;et!==null&&(oe=Math.max(oe,et.start*Ot),be=Math.min(be,(et.start+et.count)*Ot)),dt!==null?(oe=Math.max(oe,0),be=Math.min(be,dt.count)):Mt!=null&&(oe=Math.max(oe,0),be=Math.min(be,Mt.count));const Ge=be-oe;if(Ge<0||Ge===1/0)return;R.setup(F,V,xt,z,dt);let We,we=Ft;if(dt!==null&&(We=N.get(dt),we=ht,we.setIndex(We)),F.isMesh)V.wireframe===!0?(_t.setLineWidth(V.wireframeLinewidth*Fe()),we.setMode(C.LINES)):we.setMode(C.TRIANGLES);else if(F.isLine){let Dt=V.linewidth;Dt===void 0&&(Dt=1),_t.setLineWidth(Dt*Fe()),F.isLineSegments?we.setMode(C.LINES):F.isLineLoop?we.setMode(C.LINE_LOOP):we.setMode(C.LINE_STRIP)}else F.isPoints?we.setMode(C.POINTS):F.isSprite&&we.setMode(C.TRIANGLES);if(F.isBatchedMesh)if(F._multiDrawInstances!==null)zo("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),we.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances);else if(se.get("WEBGL_multi_draw"))we.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{const Dt=F._multiDrawStarts,ze=F._multiDrawCounts,le=F._multiDrawCount,Fn=dt?N.get(dt).bytesPerElement:1,jr=wt.get(V).currentProgram.getUniforms();for(let Nn=0;Nn<le;Nn++)jr.setValue(C,"_gl_DrawID",Nn),we.render(Dt[Nn]/Fn,ze[Nn])}else if(F.isInstancedMesh)we.renderInstances(oe,Ge,F.count);else if(z.isInstancedBufferGeometry){const Dt=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,ze=Math.min(z.instanceCount,Dt);we.renderInstances(oe,Ge,ze)}else we.render(oe,Ge)};function gi(v,U,z){v.transparent===!0&&v.side===on&&v.forceSinglePass===!1?(v.side=Mn,v.needsUpdate=!0,ta(v,U,z),v.side=br,v.needsUpdate=!0,ta(v,U,z),v.side=on):ta(v,U,z)}this.compile=function(v,U,z=null){z===null&&(z=v),S=It.get(z),S.init(U),I.push(S),z.traverseVisible(function(F){F.isLight&&F.layers.test(U.layers)&&(S.pushLight(F),F.castShadow&&S.pushShadow(F))}),v!==z&&v.traverseVisible(function(F){F.isLight&&F.layers.test(U.layers)&&(S.pushLight(F),F.castShadow&&S.pushShadow(F))}),S.setupLights();const V=new Set;return v.traverse(function(F){if(!(F.isMesh||F.isPoints||F.isLine||F.isSprite))return;const et=F.material;if(et)if(Array.isArray(et))for(let ut=0;ut<et.length;ut++){const xt=et[ut];gi(xt,z,F),V.add(xt)}else gi(et,z,F),V.add(et)}),S=I.pop(),V},this.compileAsync=function(v,U,z=null){const V=this.compile(v,U,z);return new Promise(F=>{function et(){if(V.forEach(function(ut){wt.get(ut).currentProgram.isReady()&&V.delete(ut)}),V.size===0){F(v);return}setTimeout(et,10)}se.get("KHR_parallel_shader_compile")!==null?et():setTimeout(et,10)})};let ii=null;function lg(v){ii&&ii(v)}function Ih(){wr.stop()}function Dh(){wr.start()}const wr=new Mm;wr.setAnimationLoop(lg),typeof self<"u"&&wr.setContext(self),this.setAnimationLoop=function(v){ii=v,st.setAnimationLoop(v),v===null?wr.stop():wr.start()},st.addEventListener("sessionstart",Ih),st.addEventListener("sessionend",Dh),this.render=function(v,U){if(U!==void 0&&U.isCamera!==!0){qe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;if(v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),st.enabled===!0&&st.isPresenting===!0&&(st.cameraAutoUpdate===!0&&st.updateCamera(U),U=st.getCamera()),v.isScene===!0&&v.onBeforeRender(E,v,U,y),S=It.get(v,I.length),S.init(U),I.push(S),Yt.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Y.setFromProjectionMatrix(Yt,Ri,U.reversedDepth),pt=this.localClippingEnabled,K=vt.init(this.clippingPlanes,pt),A=ct.get(v,w.length),A.init(),w.push(A),st.enabled===!0&&st.isPresenting===!0){const et=E.xr.getDepthSensingMesh();et!==null&&Wc(et,U,-1/0,E.sortObjects)}Wc(v,U,0,E.sortObjects),A.finish(),E.sortObjects===!0&&A.sort(Rt,ae),ne=st.enabled===!1||st.isPresenting===!1||st.hasDepthSensing()===!1,ne&&nt.addToRenderList(A,v),this.info.render.frame++,K===!0&&vt.beginShadows();const z=S.state.shadowsArray;Z.render(z,v,U),K===!0&&vt.endShadows(),this.info.autoReset===!0&&this.info.reset();const V=A.opaque,F=A.transmissive;if(S.setupLights(),U.isArrayCamera){const et=U.cameras;if(F.length>0)for(let ut=0,xt=et.length;ut<xt;ut++){const dt=et[ut];Ph(V,F,v,dt)}ne&&nt.render(v);for(let ut=0,xt=et.length;ut<xt;ut++){const dt=et[ut];Lh(A,v,dt,dt.viewport)}}else F.length>0&&Ph(V,F,v,U),ne&&nt.render(v),Lh(A,v,U);y!==null&&b===0&&(qt.updateMultisampleRenderTarget(y),qt.updateRenderTargetMipmap(y)),v.isScene===!0&&v.onAfterRender(E,v,U),R.resetDefaultState(),L=-1,B=null,I.pop(),I.length>0?(S=I[I.length-1],K===!0&&vt.setGlobalState(E.clippingPlanes,S.state.camera)):S=null,w.pop(),w.length>0?A=w[w.length-1]:A=null};function Wc(v,U,z,V){if(v.visible===!1)return;if(v.layers.test(U.layers)){if(v.isGroup)z=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(U);else if(v.isLight)S.pushLight(v),v.castShadow&&S.pushShadow(v);else if(v.isSprite){if(!v.frustumCulled||Y.intersectsSprite(v)){V&&ie.setFromMatrixPosition(v.matrixWorld).applyMatrix4(Yt);const ut=J.update(v),xt=v.material;xt.visible&&A.push(v,ut,xt,z,ie.z,null)}}else if((v.isMesh||v.isLine||v.isPoints)&&(!v.frustumCulled||Y.intersectsObject(v))){const ut=J.update(v),xt=v.material;if(V&&(v.boundingSphere!==void 0?(v.boundingSphere===null&&v.computeBoundingSphere(),ie.copy(v.boundingSphere.center)):(ut.boundingSphere===null&&ut.computeBoundingSphere(),ie.copy(ut.boundingSphere.center)),ie.applyMatrix4(v.matrixWorld).applyMatrix4(Yt)),Array.isArray(xt)){const dt=ut.groups;for(let Ot=0,kt=dt.length;Ot<kt;Ot++){const Mt=dt[Ot],oe=xt[Mt.materialIndex];oe&&oe.visible&&A.push(v,ut,oe,z,ie.z,Mt)}}else xt.visible&&A.push(v,ut,xt,z,ie.z,null)}}const et=v.children;for(let ut=0,xt=et.length;ut<xt;ut++)Wc(et[ut],U,z,V)}function Lh(v,U,z,V){const{opaque:F,transmissive:et,transparent:ut}=v;S.setupLightsView(z),K===!0&&vt.setGlobalState(E.clippingPlanes,z),V&&_t.viewport(k.copy(V)),F.length>0&&Qo(F,U,z),et.length>0&&Qo(et,U,z),ut.length>0&&Qo(ut,U,z),_t.buffers.depth.setTest(!0),_t.buffers.depth.setMask(!0),_t.buffers.color.setMask(!0),_t.setPolygonOffset(!1)}function Ph(v,U,z,V){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;S.state.transmissionRenderTarget[V.id]===void 0&&(S.state.transmissionRenderTarget[V.id]=new Gr(1,1,{generateMipmaps:!0,type:se.has("EXT_color_buffer_half_float")||se.has("EXT_color_buffer_float")?js:Li,minFilter:Or,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ue.workingColorSpace}));const et=S.state.transmissionRenderTarget[V.id],ut=V.viewport||k;et.setSize(ut.z*E.transmissionResolutionScale,ut.w*E.transmissionResolutionScale);const xt=E.getRenderTarget(),dt=E.getActiveCubeFace(),Ot=E.getActiveMipmapLevel();E.setRenderTarget(et),E.getClearColor($),Q=E.getClearAlpha(),Q<1&&E.setClearColor(16777215,.5),E.clear(),ne&&nt.render(z);const kt=E.toneMapping;E.toneMapping=xr;const Mt=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),S.setupLightsView(V),K===!0&&vt.setGlobalState(E.clippingPlanes,V),Qo(v,z,V),qt.updateMultisampleRenderTarget(et),qt.updateRenderTargetMipmap(et),se.has("WEBGL_multisampled_render_to_texture")===!1){let oe=!1;for(let be=0,Ge=U.length;be<Ge;be++){const We=U[be],{object:we,geometry:Dt,material:ze,group:le}=We;if(ze.side===on&&we.layers.test(V.layers)){const Fn=ze.side;ze.side=Mn,ze.needsUpdate=!0,Uh(we,z,V,Dt,ze,le),ze.side=Fn,ze.needsUpdate=!0,oe=!0}}oe===!0&&(qt.updateMultisampleRenderTarget(et),qt.updateRenderTargetMipmap(et))}E.setRenderTarget(xt,dt,Ot),E.setClearColor($,Q),Mt!==void 0&&(V.viewport=Mt),E.toneMapping=kt}function Qo(v,U,z){const V=U.isScene===!0?U.overrideMaterial:null;for(let F=0,et=v.length;F<et;F++){const ut=v[F],{object:xt,geometry:dt,group:Ot}=ut;let kt=ut.material;kt.allowOverride===!0&&V!==null&&(kt=V),xt.layers.test(z.layers)&&Uh(xt,U,z,dt,kt,Ot)}}function Uh(v,U,z,V,F,et){v.onBeforeRender(E,U,z,V,F,et),v.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),F.onBeforeRender(E,U,z,V,v,et),F.transparent===!0&&F.side===on&&F.forceSinglePass===!1?(F.side=Mn,F.needsUpdate=!0,E.renderBufferDirect(z,U,V,F,v,et),F.side=br,F.needsUpdate=!0,E.renderBufferDirect(z,U,V,F,v,et),F.side=on):E.renderBufferDirect(z,U,V,F,v,et),v.onAfterRender(E,U,z,V,F,et)}function ta(v,U,z){U.isScene!==!0&&(U=nn);const V=wt.get(v),F=S.state.lights,et=S.state.shadowsArray,ut=F.state.version,xt=H.getParameters(v,F.state,et,U,z),dt=H.getProgramCacheKey(xt);let Ot=V.programs;V.environment=v.isMeshStandardMaterial?U.environment:null,V.fog=U.fog,V.envMap=(v.isMeshStandardMaterial?x:M).get(v.envMap||V.environment),V.envMapRotation=V.environment!==null&&v.envMap===null?U.environmentRotation:v.envMapRotation,Ot===void 0&&(v.addEventListener("dispose",Xt),Ot=new Map,V.programs=Ot);let kt=Ot.get(dt);if(kt!==void 0){if(V.currentProgram===kt&&V.lightsStateVersion===ut)return Nh(v,xt),kt}else xt.uniforms=H.getUniforms(v),v.onBeforeCompile(xt,E),kt=H.acquireProgram(xt,dt),Ot.set(dt,kt),V.uniforms=xt.uniforms;const Mt=V.uniforms;return(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(Mt.clippingPlanes=vt.uniform),Nh(v,xt),V.needsLights=dg(v),V.lightsStateVersion=ut,V.needsLights&&(Mt.ambientLightColor.value=F.state.ambient,Mt.lightProbe.value=F.state.probe,Mt.directionalLights.value=F.state.directional,Mt.directionalLightShadows.value=F.state.directionalShadow,Mt.spotLights.value=F.state.spot,Mt.spotLightShadows.value=F.state.spotShadow,Mt.rectAreaLights.value=F.state.rectArea,Mt.ltc_1.value=F.state.rectAreaLTC1,Mt.ltc_2.value=F.state.rectAreaLTC2,Mt.pointLights.value=F.state.point,Mt.pointLightShadows.value=F.state.pointShadow,Mt.hemisphereLights.value=F.state.hemi,Mt.directionalShadowMap.value=F.state.directionalShadowMap,Mt.directionalShadowMatrix.value=F.state.directionalShadowMatrix,Mt.spotShadowMap.value=F.state.spotShadowMap,Mt.spotLightMatrix.value=F.state.spotLightMatrix,Mt.spotLightMap.value=F.state.spotLightMap,Mt.pointShadowMap.value=F.state.pointShadowMap,Mt.pointShadowMatrix.value=F.state.pointShadowMatrix),V.currentProgram=kt,V.uniformsList=null,kt}function Fh(v){if(v.uniformsList===null){const U=v.currentProgram.getUniforms();v.uniformsList=Ga.seqWithValue(U.seq,v.uniforms)}return v.uniformsList}function Nh(v,U){const z=wt.get(v);z.outputColorSpace=U.outputColorSpace,z.batching=U.batching,z.batchingColor=U.batchingColor,z.instancing=U.instancing,z.instancingColor=U.instancingColor,z.instancingMorph=U.instancingMorph,z.skinning=U.skinning,z.morphTargets=U.morphTargets,z.morphNormals=U.morphNormals,z.morphColors=U.morphColors,z.morphTargetsCount=U.morphTargetsCount,z.numClippingPlanes=U.numClippingPlanes,z.numIntersection=U.numClipIntersection,z.vertexAlphas=U.vertexAlphas,z.vertexTangents=U.vertexTangents,z.toneMapping=U.toneMapping}function ug(v,U,z,V,F){U.isScene!==!0&&(U=nn),qt.resetTextureUnits();const et=U.fog,ut=V.isMeshStandardMaterial?U.environment:null,xt=y===null?E.outputColorSpace:y.isXRRenderTarget===!0?y.texture.colorSpace:Hs,dt=(V.isMeshStandardMaterial?x:M).get(V.envMap||ut),Ot=V.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,kt=!!z.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Mt=!!z.morphAttributes.position,oe=!!z.morphAttributes.normal,be=!!z.morphAttributes.color;let Ge=xr;V.toneMapped&&(y===null||y.isXRRenderTarget===!0)&&(Ge=E.toneMapping);const We=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,we=We!==void 0?We.length:0,Dt=wt.get(V),ze=S.state.lights;if(K===!0&&(pt===!0||v!==B)){const xn=v===B&&V.id===L;vt.setState(V,v,xn)}let le=!1;V.version===Dt.__version?(Dt.needsLights&&Dt.lightsStateVersion!==ze.state.version||Dt.outputColorSpace!==xt||F.isBatchedMesh&&Dt.batching===!1||!F.isBatchedMesh&&Dt.batching===!0||F.isBatchedMesh&&Dt.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&Dt.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&Dt.instancing===!1||!F.isInstancedMesh&&Dt.instancing===!0||F.isSkinnedMesh&&Dt.skinning===!1||!F.isSkinnedMesh&&Dt.skinning===!0||F.isInstancedMesh&&Dt.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&Dt.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&Dt.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&Dt.instancingMorph===!1&&F.morphTexture!==null||Dt.envMap!==dt||V.fog===!0&&Dt.fog!==et||Dt.numClippingPlanes!==void 0&&(Dt.numClippingPlanes!==vt.numPlanes||Dt.numIntersection!==vt.numIntersection)||Dt.vertexAlphas!==Ot||Dt.vertexTangents!==kt||Dt.morphTargets!==Mt||Dt.morphNormals!==oe||Dt.morphColors!==be||Dt.toneMapping!==Ge||Dt.morphTargetsCount!==we)&&(le=!0):(le=!0,Dt.__version=V.version);let Fn=Dt.currentProgram;le===!0&&(Fn=ta(V,U,F));let jr=!1,Nn=!1,eo=!1;const Ve=Fn.getUniforms(),En=Dt.uniforms;if(_t.useProgram(Fn.program)&&(jr=!0,Nn=!0,eo=!0),V.id!==L&&(L=V.id,Nn=!0),jr||B!==v){_t.buffers.depth.getReversed()&&v.reversedDepth!==!0&&(v._reversedDepth=!0,v.updateProjectionMatrix()),Ve.setValue(C,"projectionMatrix",v.projectionMatrix),Ve.setValue(C,"viewMatrix",v.matrixWorldInverse);const Tn=Ve.map.cameraPosition;Tn!==void 0&&Tn.setValue(C,St.setFromMatrixPosition(v.matrixWorld)),Re.logarithmicDepthBuffer&&Ve.setValue(C,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&Ve.setValue(C,"isOrthographic",v.isOrthographicCamera===!0),B!==v&&(B=v,Nn=!0,eo=!0)}if(F.isSkinnedMesh){Ve.setOptional(C,F,"bindMatrix"),Ve.setOptional(C,F,"bindMatrixInverse");const xn=F.skeleton;xn&&(xn.boneTexture===null&&xn.computeBoneTexture(),Ve.setValue(C,"boneTexture",xn.boneTexture,qt))}F.isBatchedMesh&&(Ve.setOptional(C,F,"batchingTexture"),Ve.setValue(C,"batchingTexture",F._matricesTexture,qt),Ve.setOptional(C,F,"batchingIdTexture"),Ve.setValue(C,"batchingIdTexture",F._indirectTexture,qt),Ve.setOptional(C,F,"batchingColorTexture"),F._colorsTexture!==null&&Ve.setValue(C,"batchingColorTexture",F._colorsTexture,qt));const Xn=z.morphAttributes;if((Xn.position!==void 0||Xn.normal!==void 0||Xn.color!==void 0)&&zt.update(F,z,Fn),(Nn||Dt.receiveShadow!==F.receiveShadow)&&(Dt.receiveShadow=F.receiveShadow,Ve.setValue(C,"receiveShadow",F.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(En.envMap.value=dt,En.flipEnvMap.value=dt.isCubeTexture&&dt.isRenderTargetTexture===!1?-1:1),V.isMeshStandardMaterial&&V.envMap===null&&U.environment!==null&&(En.envMapIntensity.value=U.environmentIntensity),En.dfgLUT!==void 0&&(En.dfgLUT.value=i3()),Nn&&(Ve.setValue(C,"toneMappingExposure",E.toneMappingExposure),Dt.needsLights&&hg(En,eo),et&&V.fog===!0&&bt.refreshFogUniforms(En,et),bt.refreshMaterialUniforms(En,V,ot,it,S.state.transmissionRenderTarget[v.id]),Ga.upload(C,Fh(Dt),En,qt)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Ga.upload(C,Fh(Dt),En,qt),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&Ve.setValue(C,"center",F.center),Ve.setValue(C,"modelViewMatrix",F.modelViewMatrix),Ve.setValue(C,"normalMatrix",F.normalMatrix),Ve.setValue(C,"modelMatrix",F.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const xn=V.uniformsGroups;for(let Tn=0,Xc=xn.length;Tn<Xc;Tn++){const Ar=xn[Tn];lt.update(Ar,Fn),lt.bind(Ar,Fn)}}return Fn}function hg(v,U){v.ambientLightColor.needsUpdate=U,v.lightProbe.needsUpdate=U,v.directionalLights.needsUpdate=U,v.directionalLightShadows.needsUpdate=U,v.pointLights.needsUpdate=U,v.pointLightShadows.needsUpdate=U,v.spotLights.needsUpdate=U,v.spotLightShadows.needsUpdate=U,v.rectAreaLights.needsUpdate=U,v.hemisphereLights.needsUpdate=U}function dg(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return O},this.getActiveMipmapLevel=function(){return b},this.getRenderTarget=function(){return y},this.setRenderTargetTextures=function(v,U,z){const V=wt.get(v);V.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),wt.get(v.texture).__webglTexture=U,wt.get(v.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:z,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,U){const z=wt.get(v);z.__webglFramebuffer=U,z.__useDefaultFramebuffer=U===void 0};const fg=C.createFramebuffer();this.setRenderTarget=function(v,U=0,z=0){y=v,O=U,b=z;let V=!0,F=null,et=!1,ut=!1;if(v){const dt=wt.get(v);if(dt.__useDefaultFramebuffer!==void 0)_t.bindFramebuffer(C.FRAMEBUFFER,null),V=!1;else if(dt.__webglFramebuffer===void 0)qt.setupRenderTarget(v);else if(dt.__hasExternalTextures)qt.rebindTextures(v,wt.get(v.texture).__webglTexture,wt.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){const Mt=v.depthTexture;if(dt.__boundDepthTexture!==Mt){if(Mt!==null&&wt.has(Mt)&&(v.width!==Mt.image.width||v.height!==Mt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");qt.setupDepthRenderbuffer(v)}}const Ot=v.texture;(Ot.isData3DTexture||Ot.isDataArrayTexture||Ot.isCompressedArrayTexture)&&(ut=!0);const kt=wt.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Array.isArray(kt[U])?F=kt[U][z]:F=kt[U],et=!0):v.samples>0&&qt.useMultisampledRTT(v)===!1?F=wt.get(v).__webglMultisampledFramebuffer:Array.isArray(kt)?F=kt[z]:F=kt,k.copy(v.viewport),X.copy(v.scissor),W=v.scissorTest}else k.copy(ve).multiplyScalar(ot).floor(),X.copy(Te).multiplyScalar(ot).floor(),W=Ce;if(z!==0&&(F=fg),_t.bindFramebuffer(C.FRAMEBUFFER,F)&&V&&_t.drawBuffers(v,F),_t.viewport(k),_t.scissor(X),_t.setScissorTest(W),et){const dt=wt.get(v.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+U,dt.__webglTexture,z)}else if(ut){const dt=U;for(let Ot=0;Ot<v.textures.length;Ot++){const kt=wt.get(v.textures[Ot]);C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0+Ot,kt.__webglTexture,z,dt)}}else if(v!==null&&z!==0){const dt=wt.get(v.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,dt.__webglTexture,z)}L=-1},this.readRenderTargetPixels=function(v,U,z,V,F,et,ut,xt=0){if(!(v&&v.isWebGLRenderTarget)){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let dt=wt.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&ut!==void 0&&(dt=dt[ut]),dt){_t.bindFramebuffer(C.FRAMEBUFFER,dt);try{const Ot=v.textures[xt],kt=Ot.format,Mt=Ot.type;if(!Re.textureFormatReadable(kt)){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Re.textureTypeReadable(Mt)){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=v.width-V&&z>=0&&z<=v.height-F&&(v.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+xt),C.readPixels(U,z,V,F,Ht.convert(kt),Ht.convert(Mt),et))}finally{const Ot=y!==null?wt.get(y).__webglFramebuffer:null;_t.bindFramebuffer(C.FRAMEBUFFER,Ot)}}},this.readRenderTargetPixelsAsync=async function(v,U,z,V,F,et,ut,xt=0){if(!(v&&v.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let dt=wt.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&ut!==void 0&&(dt=dt[ut]),dt)if(U>=0&&U<=v.width-V&&z>=0&&z<=v.height-F){_t.bindFramebuffer(C.FRAMEBUFFER,dt);const Ot=v.textures[xt],kt=Ot.format,Mt=Ot.type;if(!Re.textureFormatReadable(kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Re.textureTypeReadable(Mt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const oe=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,oe),C.bufferData(C.PIXEL_PACK_BUFFER,et.byteLength,C.STREAM_READ),v.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+xt),C.readPixels(U,z,V,F,Ht.convert(kt),Ht.convert(Mt),0);const be=y!==null?wt.get(y).__webglFramebuffer:null;_t.bindFramebuffer(C.FRAMEBUFFER,be);const Ge=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await zv(C,Ge,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,oe),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,et),C.deleteBuffer(oe),C.deleteSync(Ge),et}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,U=null,z=0){const V=Math.pow(2,-z),F=Math.floor(v.image.width*V),et=Math.floor(v.image.height*V),ut=U!==null?U.x:0,xt=U!==null?U.y:0;qt.setTexture2D(v,0),C.copyTexSubImage2D(C.TEXTURE_2D,z,0,0,ut,xt,F,et),_t.unbindTexture()};const pg=C.createFramebuffer(),mg=C.createFramebuffer();this.copyTextureToTexture=function(v,U,z=null,V=null,F=0,et=null){et===null&&(F!==0?(zo("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),et=F,F=0):et=0);let ut,xt,dt,Ot,kt,Mt,oe,be,Ge;const We=v.isCompressedTexture?v.mipmaps[et]:v.image;if(z!==null)ut=z.max.x-z.min.x,xt=z.max.y-z.min.y,dt=z.isBox3?z.max.z-z.min.z:1,Ot=z.min.x,kt=z.min.y,Mt=z.isBox3?z.min.z:0;else{const Xn=Math.pow(2,-F);ut=Math.floor(We.width*Xn),xt=Math.floor(We.height*Xn),v.isDataArrayTexture?dt=We.depth:v.isData3DTexture?dt=Math.floor(We.depth*Xn):dt=1,Ot=0,kt=0,Mt=0}V!==null?(oe=V.x,be=V.y,Ge=V.z):(oe=0,be=0,Ge=0);const we=Ht.convert(U.format),Dt=Ht.convert(U.type);let ze;U.isData3DTexture?(qt.setTexture3D(U,0),ze=C.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(qt.setTexture2DArray(U,0),ze=C.TEXTURE_2D_ARRAY):(qt.setTexture2D(U,0),ze=C.TEXTURE_2D),C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,U.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,U.unpackAlignment);const le=C.getParameter(C.UNPACK_ROW_LENGTH),Fn=C.getParameter(C.UNPACK_IMAGE_HEIGHT),jr=C.getParameter(C.UNPACK_SKIP_PIXELS),Nn=C.getParameter(C.UNPACK_SKIP_ROWS),eo=C.getParameter(C.UNPACK_SKIP_IMAGES);C.pixelStorei(C.UNPACK_ROW_LENGTH,We.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,We.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,Ot),C.pixelStorei(C.UNPACK_SKIP_ROWS,kt),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Mt);const Ve=v.isDataArrayTexture||v.isData3DTexture,En=U.isDataArrayTexture||U.isData3DTexture;if(v.isDepthTexture){const Xn=wt.get(v),xn=wt.get(U),Tn=wt.get(Xn.__renderTarget),Xc=wt.get(xn.__renderTarget);_t.bindFramebuffer(C.READ_FRAMEBUFFER,Tn.__webglFramebuffer),_t.bindFramebuffer(C.DRAW_FRAMEBUFFER,Xc.__webglFramebuffer);for(let Ar=0;Ar<dt;Ar++)Ve&&(C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,wt.get(v).__webglTexture,F,Mt+Ar),C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,wt.get(U).__webglTexture,et,Ge+Ar)),C.blitFramebuffer(Ot,kt,ut,xt,oe,be,ut,xt,C.DEPTH_BUFFER_BIT,C.NEAREST);_t.bindFramebuffer(C.READ_FRAMEBUFFER,null),_t.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else if(F!==0||v.isRenderTargetTexture||wt.has(v)){const Xn=wt.get(v),xn=wt.get(U);_t.bindFramebuffer(C.READ_FRAMEBUFFER,pg),_t.bindFramebuffer(C.DRAW_FRAMEBUFFER,mg);for(let Tn=0;Tn<dt;Tn++)Ve?C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,Xn.__webglTexture,F,Mt+Tn):C.framebufferTexture2D(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,Xn.__webglTexture,F),En?C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,xn.__webglTexture,et,Ge+Tn):C.framebufferTexture2D(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,xn.__webglTexture,et),F!==0?C.blitFramebuffer(Ot,kt,ut,xt,oe,be,ut,xt,C.COLOR_BUFFER_BIT,C.NEAREST):En?C.copyTexSubImage3D(ze,et,oe,be,Ge+Tn,Ot,kt,ut,xt):C.copyTexSubImage2D(ze,et,oe,be,Ot,kt,ut,xt);_t.bindFramebuffer(C.READ_FRAMEBUFFER,null),_t.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else En?v.isDataTexture||v.isData3DTexture?C.texSubImage3D(ze,et,oe,be,Ge,ut,xt,dt,we,Dt,We.data):U.isCompressedArrayTexture?C.compressedTexSubImage3D(ze,et,oe,be,Ge,ut,xt,dt,we,We.data):C.texSubImage3D(ze,et,oe,be,Ge,ut,xt,dt,we,Dt,We):v.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,et,oe,be,ut,xt,we,Dt,We.data):v.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,et,oe,be,We.width,We.height,we,We.data):C.texSubImage2D(C.TEXTURE_2D,et,oe,be,ut,xt,we,Dt,We);C.pixelStorei(C.UNPACK_ROW_LENGTH,le),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,Fn),C.pixelStorei(C.UNPACK_SKIP_PIXELS,jr),C.pixelStorei(C.UNPACK_SKIP_ROWS,Nn),C.pixelStorei(C.UNPACK_SKIP_IMAGES,eo),et===0&&U.generateMipmaps&&C.generateMipmap(ze),_t.unbindTexture()},this.initRenderTarget=function(v){wt.get(v).__webglFramebuffer===void 0&&qt.setupRenderTarget(v)},this.initTexture=function(v){v.isCubeTexture?qt.setTextureCube(v,0):v.isData3DTexture?qt.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?qt.setTexture2DArray(v,0):qt.setTexture2D(v,0),_t.unbindTexture()},this.resetState=function(){O=0,b=0,y=null,_t.reset(),R.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ri}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=ue._getDrawingBufferColorSpace(t),e.unpackColorSpace=ue._getUnpackColorSpace()}}const s3=["boost","brake"],o3={boost:["ShiftLeft","ShiftRight"],brake:["Space"]},Tf={reset:["KeyR"],toggleJam:["KeyJ"],toggleMode:["KeyM"],cycleCamera:["KeyC"],pause:["Escape"],toggleHelp:["KeyH"]},Cf=.12;class vh{keys=new Set;actions;lastButtonStates=[];constructor(){this.actions=vh.defaultCommand(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp)}dispose(){window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp)}get connectedGamepad(){const t=navigator.getGamepads();for(const e of t)if(e?.connected)return e.id||"Controle";return null}sample(){const t=navigator.getGamepads();let e=null;for(const a of t)if(a?.connected){e=a;break}let i=0,r=0,s=0,o=0;this.keys.has("KeyA")&&(i-=1),this.keys.has("KeyD")&&(i+=1),this.keys.has("KeyW")&&(r+=1),this.keys.has("KeyS")&&(r-=1),(this.keys.has("KeyQ")||this.keys.has("ArrowLeft"))&&(s-=1),(this.keys.has("KeyE")||this.keys.has("ArrowRight"))&&(s+=1),this.keys.has("ArrowUp")&&(o+=1),this.keys.has("ArrowDown")&&(o-=1);for(const a of s3){const c=o3[a];this.actions[a]=c.some(l=>this.keys.has(l))}if(e){const a=this.applyRadialDeadzone(e.axes[0]??0,e.axes[1]??0,Cf),c=this.applyRadialDeadzone(e.axes[2]??0,e.axes[3]??0,Cf);Math.abs(a.x)>0&&(i=a.x),Math.abs(a.y)>0&&(r=a.y),Math.abs(c.x)>0&&(s=c.x),Math.abs(c.y)>0&&(o=(-c.y+1)/2);const l=e.buttons[7]?.value??0,u=e.buttons[6]?.value??0;l>.5&&(this.actions.boost=!0),u>.5&&(this.actions.brake=!0);const h=e.buttons.map(f=>f.pressed),d=h.map((f,g)=>f&&!this.lastButtonStates[g]);d[0]&&(this.actions.reset=!0),d[1]&&(this.actions.toggleMode=!0),d[2]&&(this.actions.toggleJam=!0),d[3]&&(this.actions.cycleCamera=!0),(d[8]||d[9])&&(this.actions.pause=!0),this.lastButtonStates=h}return this.actions.throttle=he.clamp(o,0,1),this.actions.roll=he.clamp(i,-1,1),this.actions.pitch=he.clamp(r,-1,1),this.actions.yaw=he.clamp(s,-1,1),this.actions}onKeyDown=t=>{const e=!this.keys.has(t.code);if(this.keys.add(t.code),e){for(const i of Object.keys(Tf))if(Tf[i].includes(t.code)){this.actions[i]=!0;break}}["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(t.code)&&t.preventDefault()};onKeyUp=t=>{this.keys.delete(t.code)};applyRadialDeadzone(t,e,i){const r=Math.hypot(t,e);if(r<i)return{x:0,y:0};const o=(r-i)/(1-i)/r;return{x:t*o,y:e*o}}static defaultCommand(){return{throttle:0,roll:0,pitch:0,yaw:0,boost:!1,brake:!1,reset:!1,toggleJam:!1,toggleMode:!1,cycleCamera:!1,pause:!1,toggleHelp:!1}}}class a3{position=new T;velocity=new T;quaternion=new Ji;angularVelocity=new T;rotorSpeed=0;mass=1;maxThrust=19.62;armLength=.35;yawFactor=.035;maxRollRate=3;maxPitchRate=3;maxYawRate=2.2;rateP=8;rateD=1.2;yawP=5;yawD=.8;linearDrag=.35;angularDrag=.45;inertia=.12;groundLevel=0;groundRestitution=.25;groundFriction=.35;_worldUp=new T(0,1,0);_force=new T;_thrustWorld=new T;_omegaBody=new T;_torqueBody=new T;_qInv=new Ji;_rotorSpin=new T;_qDot=new Ji;_tmpQ=new Ji;_tmpV=new T;constructor(){this.quaternion.identity()}reset(t){this.position.copy(t??new T),this.velocity.set(0,0,0),this.quaternion.identity(),this.angularVelocity.set(0,0,0),this.rotorSpeed=0}step(t,e){const i=Math.max(0,Math.min(e,.05));if(i===0)return;const r=he.clamp(t.throttle,0,1),s=he.clamp(t.roll,-1,1),o=he.clamp(t.pitch,-1,1),a=he.clamp(t.yaw,-1,1);this._qInv.copy(this.quaternion).invert(),this._omegaBody.copy(this.angularVelocity).applyQuaternion(this._qInv);const c=s*this.maxRollRate,l=o*this.maxPitchRate,u=a*this.maxYawRate;this._torqueBody.set(this.rateP*(c-this._omegaBody.x)-this.rateD*this._omegaBody.x,this.yawP*(u-this._omegaBody.y)-this.yawD*this._omegaBody.y,this.rateP*(l-this._omegaBody.z)-this.rateD*this._omegaBody.z);const h=r*this.maxThrust/4,d=this.maxThrust/2,f=-this._torqueBody.x/(4*this.armLength),g=this._torqueBody.z/(4*this.armLength),_=this._torqueBody.y/(4*this.yawFactor),m=he.clamp(h+f+g-_,0,d),p=he.clamp(h-f+g+_,0,d),A=he.clamp(h+f-g+_,0,d),S=he.clamp(h-f-g-_,0,d),w=m+p+A+S;this.rotorSpeed=Math.sqrt(w/this.maxThrust),this._thrustWorld.set(0,w,0).applyQuaternion(this.quaternion),this._force.copy(this._thrustWorld),this._force.y-=this.mass*9.81,this._force.addScaledVector(this.velocity,-this.linearDrag);const I=this._tmpV.copy(this._force).divideScalar(this.mass);this.velocity.addScaledVector(I,i),this.position.addScaledVector(this.velocity,i);const E=this.armLength*(m+A-p-S),D=this.yawFactor*(p+A-m-S),O=this.armLength*(m+p-A-S);this._tmpQ.copy(this.quaternion),this._rotorSpin.set(E,D,O),this._rotorSpin.applyQuaternion(this._tmpQ);const b=this._tmpV.copy(this.angularVelocity).multiplyScalar(-this.angularDrag),y=this._tmpV.copy(this._rotorSpin).add(b).divideScalar(this.inertia);if(this.angularVelocity.addScaledVector(y,i),this._qDot.set(this.angularVelocity.x,this.angularVelocity.y,this.angularVelocity.z,0),this._qDot.multiply(this.quaternion),this._qDot.x*=.5,this._qDot.y*=.5,this._qDot.z*=.5,this._qDot.w*=.5,this.quaternion.x+=this._qDot.x*i,this.quaternion.y+=this._qDot.y*i,this.quaternion.z+=this._qDot.z*i,this.quaternion.w+=this._qDot.w*i,this.quaternion.normalize(),this.position.y<this.groundLevel){this.position.y=this.groundLevel,this.velocity.y<0&&(this.velocity.y*=-this.groundRestitution);const L=Math.max(0,1-this.groundFriction*i);this.velocity.x*=L,this.velocity.z*=L,this.angularVelocity.multiplyScalar(Math.max(0,1-2*i))}}}function Cm(n){return Math.max(0,Math.min(1,n))}function c3(n,t,e){const i=Cm((n-t)/(e-t));return i*i*(3-2*i)}function l3(n){return()=>{n|=0,n=n+1831565813|0;let t=Math.imul(n^n>>>15,1|n);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}class u3{rng;overlay;canvas;ctx;jamBanner;spoofBanner;_active=!1;_intensity=0;_severity="ok";_reportedPosition=new T;_reportedVelocity=new T;_sats=12;_snr=45;_epu=1.5;_hasFix=!0;_dropoutTimer=0;_inDropout=!1;_drift=new T;_walk=new T;_velocityBias=new T;_time=0;constructor(t=document.body,e=12345){this.rng=l3(e),this.overlay=this.getOrCreateOverlay(t),this.canvas=this.getOrCreateCanvas(this.overlay);const i=this.canvas.getContext("2d");if(!i)throw new Error("Jamming: could not create 2d context");this.ctx=i,this.jamBanner=this.getOrCreateBanner(this.overlay,"jamming-banner","JAMMING GNSS DETECTADO"),this.spoofBanner=this.getOrCreateBanner(this.overlay,"spoofing-banner","SPOOFING GNSS DETECTADO"),this.resizeCanvas(),window.addEventListener("resize",this.resizeCanvas)}get active(){return this._active}get intensity(){return this._intensity}get severity(){return this._severity}get sats(){return Math.round(this._sats)}get snr(){return Math.round(this._snr*10)/10}get epu(){return Math.round(this._epu*10)/10}get hasFix(){return this._hasFix}get reportedPosition(){return this._reportedPosition.clone()}get reportedVelocity(){return this._reportedVelocity.clone()}getState(){return{active:this._active,intensity:this._intensity,severity:this._severity,sats:this.sats,snr:this.snr,epu:this.epu,hasFix:this._hasFix,reportedPosition:this.reportedPosition,reportedVelocity:this.reportedVelocity}}setActive(t){this._active!==t&&(this._active=t,this.overlay.classList.toggle("active",t),t?this._dropoutTimer=.05:(this._severity="ok",this._inDropout=!1,this._dropoutTimer=0,this.overlay.classList.remove("jamming","spoofing"),this.clearCanvas()))}setIntensity(t){this._intensity=Cm(t)}reset(){this._active=!1,this._intensity=0,this._severity="ok",this._sats=12,this._snr=45,this._epu=1.5,this._hasFix=!0,this._dropoutTimer=0,this._inDropout=!1,this._drift.set(0,0,0),this._walk.set(0,0,0),this._velocityBias.set(0,0,0),this._time=0,this._reportedPosition.set(0,0,0),this._reportedVelocity.set(0,0,0),this.overlay.classList.remove("active","jamming","spoofing"),this.clearCanvas()}update(t,e,i){if(this._time===0&&(this._reportedPosition.copy(t),this._reportedVelocity.copy(e)),this._time+=i,!this._active||this._intensity<=0){this._reportedPosition.copy(t),this._reportedVelocity.copy(e),this._severity="ok",this._sats=he.lerp(this._sats,12,.1),this._snr=he.lerp(this._snr,45,.1),this._epu=he.lerp(this._epu,1.5,.1),this._hasFix=!0,this._drift.multiplyScalar(.92),this._walk.multiplyScalar(.92),this._velocityBias.multiplyScalar(.92),this.overlay.classList.remove("jamming","spoofing"),this._active&&this._intensity>0?this.drawNoise():this.clearCanvas();return}const r=c3(this._intensity,.25,.7),s=this.rng()<r;if(this._severity=s?"spoofed":"jammed",this.overlay.classList.toggle("jamming",!s),this.overlay.classList.toggle("spoofing",s),this._inDropout)this._dropoutTimer-=i,this._dropoutTimer<=0&&(this._inDropout=!1,this._dropoutTimer=.2+this.rng()*(1.2-this._intensity*.8));else{this._dropoutTimer-=i;const f=this._intensity*.35*i;(this._dropoutTimer<=0||this.rng()<f)&&(this._inDropout=!0,this._dropoutTimer=.05+this.rng()*(.4+this._intensity*.8))}let o,a,c,l;this._inDropout?(o=Math.floor(this.rng()*2),a=8+this.rng()*12,c=25+this._intensity*120,l=!1):s?(o=8+Math.floor(this.rng()*5),a=32+this.rng()*14,c=2+this._intensity*40,l=!0):(o=Math.max(0,Math.floor(4+this.rng()*4-this._intensity*6)),a=14+this.rng()*16,c=10+this._intensity*90,l=this.rng()>this._intensity*.7);const u=Math.min(1,i*5);this._sats=he.lerp(this._sats,o,u),this._snr=he.lerp(this._snr,a,u),this._epu=he.lerp(this._epu,c,u),this._hasFix=l;const h=s?1:.25;this._drift.x+=(this.rng()-.5)*this._intensity*h*i*4,this._drift.y+=(this.rng()-.5)*this._intensity*h*i*4,this._drift.z+=(this.rng()-.5)*this._intensity*h*i*4,this._drift.clampLength(0,2+this._intensity*40);const d=(s?.3:1.2)*this._intensity;this._walk.x+=(this.rng()-.5)*d*Math.sqrt(i),this._walk.y+=(this.rng()-.5)*d*Math.sqrt(i),this._walk.z+=(this.rng()-.5)*d*Math.sqrt(i),this._walk.multiplyScalar(.95),this._velocityBias.x+=(this.rng()-.5)*this._intensity*i*2,this._velocityBias.y+=(this.rng()-.5)*this._intensity*i*2,this._velocityBias.z+=(this.rng()-.5)*this._intensity*i*2,this._velocityBias.clampLength(0,1+this._intensity*6),this._inDropout?(this._reportedPosition.addScaledVector(this._walk,.05),this._reportedVelocity.set(0,0,0).addScaledVector(this._velocityBias,.3)):(this._reportedPosition.copy(t).add(this._drift).add(this._walk),this._reportedVelocity.copy(e).add(this._velocityBias)),this.drawNoise()}dispose(){window.removeEventListener("resize",this.resizeCanvas),this.overlay.remove()}resizeCanvas=()=>{const e=Math.max(32,Math.floor(128*(window.innerHeight/window.innerWidth)));this.canvas.width=128,this.canvas.height=e};getOrCreateOverlay(t){const e=document.getElementById("rf-overlay");if(e)return e;const i=document.createElement("div");return i.id="rf-overlay",t.appendChild(i),i}getOrCreateCanvas(t){const e=t.querySelector("canvas");if(e)return e;const i=document.createElement("canvas");return t.appendChild(i),i}getOrCreateBanner(t,e,i){const r=t.querySelector(`.${e}`);if(r)return r;const s=document.createElement("div");return s.className=e,s.textContent=i,t.appendChild(s),s}drawNoise(){const t=this._active?.08+this._intensity*.42:0;if(t<=.005){this.clearCanvas();return}const e=this.canvas.width,i=this.canvas.height,r=this.ctx.createImageData(e,i),s=r.data,o=this._severity==="spoofed",a=o?220:240,c=o?70:235,l=o?70:230;for(let u=0;u<s.length;u+=4){const h=Math.floor(this.rng()*255);s[u]=Math.floor(h*a/255),s[u+1]=Math.floor(h*c/255),s[u+2]=Math.floor(h*l/255),s[u+3]=Math.floor(t*255)}this.ctx.putImageData(r,0,0)}clearCanvas(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)}}const h3={demo:"Demo",manual:"Fly","manual-jammed":"Fly + Jam"},d3={demo:"reproduzindo telemetria gravada",manual:"voo manual ativo","manual-jammed":"voo manual com interferência GPS"},f3={none:"NONE","2d":"2D","3d":"3D",dgps:"DGPS"},rn={modeBanner:xi("modeBanner",HTMLElement),controllerStatus:xi("controllerStatus",HTMLElement),gpsFix:xi("gpsFix",HTMLElement),gpsSats:xi("gpsSats",HTMLElement),gpsHdop:xi("gpsHdop",HTMLElement),gpsJamming:xi("gpsJamming",HTMLElement),gpsJammingRow:xi("gpsJammingRow",HTMLElement),helpOverlay:xi("helpOverlay",HTMLElement),helpToggle:xi("helpToggle",HTMLButtonElement),helpClose:xi("helpClose",HTMLButtonElement)};function xi(n,t){const e=document.getElementById(n);return e==null||!(e instanceof t)?null:e}function p3(n){return n==null?"--":n.toFixed(1)}function yh(n){const t=rn.modeBanner;t!=null&&(t.setAttribute("data-mode",n),t.innerHTML=`<span>${h3[n]}</span> — ${d3[n]}`);for(const e of["demo","manual","manual-jammed"]){const i=document.getElementById(`mode-${e}`);i instanceof HTMLButtonElement&&i.setAttribute("aria-pressed",String(e===n))}}function m3(n){const t=rn.controllerStatus;t!=null&&(n==null||n===""?(t.textContent="Nenhum",t.classList.remove("connected"),t.classList.add("disconnected")):(t.textContent=n,t.classList.remove("disconnected"),t.classList.add("connected")))}function Rm(n){rn.gpsFix!=null&&(rn.gpsFix.textContent=f3[n.fix]??"--"),rn.gpsSats!=null&&(rn.gpsSats.textContent=String(n.satellites)),rn.gpsHdop!=null&&(rn.gpsHdop.textContent=p3(n.hdop));const t=rn.gpsJammingRow,e=rn.gpsJamming;t!=null&&e!=null&&(n.jammed?(e.textContent="JAM",t.classList.remove("severity-ok","severity-warn"),t.classList.add("severity-danger")):(e.textContent="OK",t.classList.remove("severity-danger","severity-warn"),t.classList.add("severity-ok")))}function bh(){const n=rn.helpOverlay,t=rn.helpToggle;n?.setAttribute("aria-hidden","false"),t?.setAttribute("aria-expanded","true")}function Uu(){const n=rn.helpOverlay,t=rn.helpToggle;n?.setAttribute("aria-hidden","true"),t?.setAttribute("aria-expanded","false")}function g3(){rn.helpToggle?.addEventListener("click",()=>{rn.helpOverlay?.getAttribute("aria-hidden")!=="false"?bh():Uu()}),rn.helpClose?.addEventListener("click",Uu)}function x3(n){for(const t of["demo","manual","manual-jammed"]){const e=document.getElementById(`mode-${t}`);e instanceof HTMLButtonElement&&e.addEventListener("click",()=>{yh(t),n(t)})}g3()}const _3=150,v3=.6,y3=1400;let tr=1,Im=0,Dm=0,Lm=0;function Wo(n,t,e){return new T((n-Im)*tr,(e-Lm)*tr+v3,(-t-Dm)*tr)}const Xs=document.querySelector("#scene"),b3=document.querySelector("#app"),Sh=document.querySelector("#stats"),Pm=document.querySelector("#readout"),Um=document.querySelector("#drop"),Wa=document.querySelector("#instrument"),Fm=document.querySelector("#missionPhase"),Nm=document.querySelector("#hudPhase"),Bm=document.querySelector("#hudSpeed"),Om=document.querySelector("#hudAlt"),zm=document.querySelector("#hudDrift"),Vm=document.querySelector("#hudLink"),Ec=document.querySelector("#playPause"),Fu=document.querySelector("#presentationMode"),Mh=document.querySelector("#speed"),S3=document.querySelector("#playbackRate"),Tc=document.querySelector("#scrub"),km=Array.from(document.querySelectorAll("[data-camera]")),Hm=Array.from(document.querySelectorAll("[data-layer]")),zc=new r3({canvas:Xs,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0});zc.setPixelRatio(Math.min(window.devicePixelRatio,2));zc.setClearColor(13101041,1);const ni=new Ey;ni.background=new Zt(13101041);ni.fog=new mh(12967900,.00115);const Ne=new Zn(54,1,.1,2e3);Ne.position.set(-42,32,-58);const M3=new fb(16777204,7635043,2.55);ni.add(M3);const Gm=new Sm(16773583,3.75);Gm.position.set(-110,160,90);ni.add(Gm);const Wm=new Sm(13104127,1);Wm.position.set(95,80,-140);ni.add(Wm);const yn=new Ae;ni.add(yn);const w3=E3();ni.add(w3);const Xo=[],Xm=[],qm=new xb(560,56,11910567,8491132);qm.position.y=-.035;yn.add(qm);const wh=new mt(new an(580,580),new Ze({color:8490083,roughness:.94,metalness:.02}));wh.rotation.x=-Math.PI/2;wh.position.y=-.08;yn.add(wh);const A3=G3();yn.add(A3);const Ym=P3();yn.add(Ym);const $m=L3();yn.add($m);const Ah=[],sn=W3();ni.add(sn);const Vc=new mt(new Sr(1.1,16,8),new de({color:6804410,transparent:!0,opacity:.32}));ni.add(Vc);const kc=Th(10155999,.38);ni.add(kc);const Hc=Th(7858897,.85),Gc=Th(14134613,.55);ni.add(Hc,Gc);let fr=null,pr=null,Xi=null,ws=null,As=null,$t=null,Mi=0,_r=!0,pn="orbit",Rf=performance.now(),qo=-.95,qs=.32,di=112,qi=null,Eh=0,Co=!1;const dn={trajectory:!0,vectors:!0,airspace:!0,range:!0};let je="demo";const If=new vh,Vn=new a3,Hn=new u3(document.body),Xa=new T,Df=document.getElementById("helpOverlay");function E3(){const n=new Ae,t=document.createElement("canvas");t.width=32,t.height=512;const e=t.getContext("2d"),i=e.createLinearGradient(0,0,0,t.height);i.addColorStop(0,"#d3f0ff"),i.addColorStop(.24,"#a7d8f1"),i.addColorStop(.6,"#b8d7c4"),i.addColorStop(1,"#efdca3"),e.fillStyle=i,e.fillRect(0,0,t.width,t.height);const r=new lm(t);r.colorSpace=Rn;const s=new mt(new Sr(900,32,16),new de({map:r,side:Mn,fog:!1}));s.position.y=-80,n.add(s);const o=new mt(new Wr(38,48),new de({color:16774348,transparent:!0,opacity:1,fog:!1,depthWrite:!1}));o.position.set(-250,210,-520),o.rotation.y=.48,n.add(o);const a=new mt(new Wr(134,48),new de({color:16770989,transparent:!0,opacity:.2,fog:!1,depthWrite:!1}));return a.position.copy(o.position),a.rotation.copy(o.rotation),n.add(a),n.add(T3()),n.add(C3()),n.add(R3()),n.add(I3()),n.add(D3()),n}function T3(){const n=new Ae,t=Lf(1040,92,[[0,"rgba(255, 224, 155, 0)"],[.42,"rgba(255, 216, 128, 0.2)"],[1,"rgba(255, 216, 128, 0)"]]);t.position.set(-60,34,-520),t.rotation.x=-.08,n.add(t);const e=Lf(1040,120,[[0,"rgba(192, 242, 246, 0)"],[.5,"rgba(192, 242, 246, 0.16)"],[1,"rgba(192, 242, 246, 0)"]]);e.position.set(80,62,-540),e.rotation.x=-.08,n.add(e);const i=new mt(new an(1080,2.2),new de({color:16773562,transparent:!0,opacity:.2,fog:!1,depthWrite:!1,side:on}));return i.position.set(0,25,-515),i.rotation.x=-.08,n.add(i),n}function Lf(n,t,e){const i=document.createElement("canvas");i.width=8,i.height=256;const r=i.getContext("2d"),s=r.createLinearGradient(0,0,0,i.height);for(const[c,l]of e)s.addColorStop(c,l);r.fillStyle=s,r.fillRect(0,0,i.width,i.height);const o=new lm(i);o.colorSpace=Rn;const a=new mt(new an(n,t),new de({map:o,transparent:!0,fog:!1,depthWrite:!1,side:on}));return a.renderOrder=-10,a}function C3(){const n=new Ae,t=Zo(6104),e=[new de({color:5599837,transparent:!0,opacity:.48,fog:!1,depthWrite:!1,side:on}),new de({color:8361336,transparent:!0,opacity:.34,fog:!1,depthWrite:!1,side:on})];for(let i=0;i<2;i++){const r=[new ft(-520,-12)];for(let o=0;o<=28;o++){const a=-520+o/28*1040,c=2+i*5+Math.sin(o*.7+i)*4+t()*8;r.push(new ft(a,c))}r.push(new ft(520,-12));const s=new mt(new Nc(new _h(r)),e[i]);s.position.set(0,10+i*6,-560-i*42),n.add(s)}return n}function R3(){const n=new Ae,t=Zo(4229),e=[new de({color:16777215,transparent:!0,opacity:.28,fog:!1,depthWrite:!1}),new de({color:14873590,transparent:!0,opacity:.16,fog:!1,depthWrite:!1})];for(let i=0;i<30;i++){const r=i%3===0,s=new mt(new Sr(1,12,6),r?e[1]:e[0]);s.position.set(-430+t()*860,98+t()*(r?150:70),-460+t()*180),s.scale.set(22+t()*74,2.6+t()*7,7+t()*24),s.rotation.y=t()*Math.PI,n.add(s)}return n}function I3(){const n=new Ae,t=new Pn({color:16777215,transparent:!0,opacity:.36,fog:!1}),e=Zo(8181);for(let i=0;i<7;i++){const r=125+e()*185,s=-380-e()*210,o=-390+e()*780,a=120+e()*210,c=-12+e()*24,l=[new T(o,r,s),new T(o+a*.5,r+c*.45,s-18-e()*28),new T(o+a,r+c,s-34-e()*36)],u=new Un(new Ee().setFromPoints(l),t);u.rotation.y=-.18+e()*.36,n.add(u)}return n}function D3(){const n=new Ae,t=[13104127,16765818,16777215];for(let e=0;e<3;e++){const i=new mt(new Ko(520+e*38,522+e*38,96,1,Math.PI*.08,Math.PI*.84),new de({color:t[e],transparent:!0,opacity:.045-e*.007,fog:!1,depthWrite:!1,side:on}));i.position.set(-80+e*70,64+e*24,-560),i.rotation.x=Math.PI*.5,i.rotation.z=-.06+e*.08,n.add(i)}return n}function L3(){const n=new Ae,t=new Ze({color:3095346,roughness:.8,metalness:.02}),e=new mt(new Ko(8,10.5,64),t);e.rotation.x=-Math.PI/2,e.position.y=.03,n.add(e);const i=new Pn({color:14134613,transparent:!0,opacity:.42});for(const c of[35,70,105,140]){const u=new Fc(0,0,c,c,0,Math.PI*2).getPoints(128).map(h=>new T(h.x,.04,h.y));n.add(new Ly(new Ee().setFromPoints(u),i))}const r=new Pn({color:7329989,transparent:!0,opacity:.28}),s=new Ee().setFromPoints([new T(0,0,0),new T(0,90,0)]);n.add(new Un(s,r));const o=new de({color:14134613,transparent:!0,opacity:.12,depthWrite:!1}),a=new mt(new an(8,180),o);return a.rotation.x=-Math.PI/2,a.rotation.z=Math.PI/5,a.position.y=.02,n.add(a),n}function P3(){const n=new Ae;return n.add(U3()),n.add(F3()),n.add(N3()),n.add(B3()),n.add(O3()),n.add(z3()),n.add(V3()),n.add(k3()),n.add(H3()),n}function U3(){const n=new Ae,t=[{x:-185,z:70,w:74,d:330,color:3424300,opacity:.42},{x:-112,z:85,w:44,d:300,color:2505787,opacity:.36},{x:150,z:88,w:62,d:320,color:3879207,opacity:.34},{x:218,z:62,w:34,d:260,color:2503233,opacity:.28}];for(const i of t){const r=new mt(new an(i.w,i.d),new de({color:i.color,transparent:!0,opacity:i.opacity,depthWrite:!1}));r.rotation.x=-Math.PI/2,r.position.set(i.x,-.055,i.z),n.add(r)}const e=new Pn({color:10794399,transparent:!0,opacity:.12});for(let i=-220;i<=235;i+=22){const r=new Un(new Ee().setFromPoints([new T(i,.015,-110),new T(i+28,.015,230)]),e);n.add(r)}return n}function F3(){const n=new Ae;n.rotation.y=-Math.PI/5;const t=new mt(new an(18,190),new Ze({color:1909537,roughness:.86,metalness:.03}));t.rotation.x=-Math.PI/2,t.position.y=-.03,n.add(t);const e=new de({color:12109239,transparent:!0,opacity:.08,depthWrite:!1});for(const o of[-11.4,11.4]){const a=new mt(new an(.6,176),e);a.rotation.x=-Math.PI/2,a.position.set(o,.015,0),n.add(a)}const i=new de({color:15853258,transparent:!0,opacity:.72,depthWrite:!1});for(let o=-70;o<=70;o+=28){const a=new mt(new an(.9,10),i);a.rotation.x=-Math.PI/2,a.position.set(0,.02,o),n.add(a)}for(const o of[-84,84])for(const a of[-5.2,-2.6,2.6,5.2]){const c=new mt(new an(1.3,10),i);c.rotation.x=-Math.PI/2,c.position.set(a,.022,o),n.add(c)}const r=new de({color:7858897,transparent:!0,opacity:.78});for(let o=-88;o<=88;o+=16)for(const a of[-10.2,10.2]){const c=new mt(new cn(.42,.18,.42),r);c.position.set(a,.12,o),n.add(c)}const s=new mt(new an(46,32),new Ze({color:2370088,roughness:.88,metalness:.02}));return s.rotation.x=-Math.PI/2,s.position.set(-42,-.025,-62),n.add(s),n}function N3(){const n=new Ae;n.rotation.y=-Math.PI/5,n.add(Dl(-56,-72,18,20,6,3160637,5857380)),n.add(Dl(-35,-77,14,16,4.8,3485481,6840143)),n.add(Dl(-63,-46,12,12,4.4,2504762,5072226));const t=new Ze({color:14134613,roughness:.48,metalness:.08});for(const[e,i]of[[-35,-54],[-49,-55],[-58,-33]]){const r=new mt(new cn(3.8,1.3,2.1),t);r.position.set(e,.72,i),n.add(r)}return n}function Dl(n,t,e,i,r,s,o){const a=new Ae,c=new mt(new cn(e,r,i),new Ze({color:s,roughness:.72,metalness:.08}));c.position.y=r*.5;const l=new mt(new pi(e*.58,e*.58,i+1.2,3,1,!1),new Ze({color:o,roughness:.64,metalness:.12}));l.rotation.x=Math.PI/2,l.rotation.z=Math.PI/2,l.position.y=r+1.15;const u=new mt(new an(e*.58,r*.58),new de({color:1382937,transparent:!0,opacity:.72}));return u.position.set(0,r*.42,i*.505),a.add(c,l,u),a.position.set(n,0,t),a}function B3(){const n=new Ae;n.rotation.y=-Math.PI/5;const t=new Ze({color:2635320,roughness:.68,metalness:.12}),e=new de({color:9434332,transparent:!0,opacity:.26}),i=new de({color:14134613,transparent:!0,opacity:.46}),r=new mt(new cn(5.4,16,5.4),t);r.position.set(-86,8,-34);const s=new mt(new cn(12.5,5.2,9.5),t);s.position.set(-86,18.9,-34);const o=new mt(new cn(12.8,2.2,9.8),e);o.position.set(-86,19.8,-34);const a=new Un(new Ee().setFromPoints([new T(-86,21.8,-34),new T(-86,34,-34)]),new Pn({color:12179146,transparent:!0,opacity:.52}));n.add(r,s,o,a);for(let u=0;u<4;u++){const h=new mt(new an(5.8,1.6),i);h.rotation.x=-Math.PI/2,h.position.set(-104+u*7.5,.08,-23),n.add(h)}const c=new de({color:1120022,transparent:!0,opacity:.72}),l=new de({color:7729108,transparent:!0,opacity:.2});for(let u=0;u<3;u++){const h=new mt(new cn(.3,7,9),c);h.position.set(-112+u*10,3.5,-14);const d=new mt(new an(6,3.2),l);d.position.set(-112+u*10,4.5,-13.82),n.add(h,d)}return n}function O3(){const n=new Ae,t=new Ze({color:2436911,roughness:.72,metalness:.14}),e=new Ze({color:4675675,roughness:.55,metalness:.18}),i=new Ze({color:6385774,roughness:.5,metalness:.16,side:on}),r=new de({color:7598035,transparent:!0,opacity:.16,depthWrite:!1,side:on}),s=new mt(new pi(5.8,7.6,3.2,28),t);s.position.set(88,1.6,-72);const o=new mt(new pi(1.6,2.2,9.5,18),t);o.position.set(88,7.7,-72);const a=new Ae;a.position.set(88,14.2,-72);const c=new mt(new Sr(7.2,24,12,0,Math.PI*2,0,Math.PI*.44),i);c.rotation.x=Math.PI*.5,c.rotation.z=-.28,c.scale.z=.42,a.add(c),Xo.push(a),n.add(s,o,a);const l=new mt(new Wr(96,64,0,Math.PI*.38),r);l.rotation.x=-Math.PI/2,l.position.set(88,.07,-72),Xo.push(l),n.add(l);const u=new mt(new Sr(11,28,12,0,Math.PI*2,0,Math.PI*.5),new de({color:10483428,transparent:!0,opacity:.08,depthWrite:!1}));u.position.set(127,0,-45),n.add(u);for(let h=0;h<5;h++){const d=new mt(new cn(9,.32,5),e);d.position.set(110+h*9.5,1.1,-24+Math.sin(h)*4),d.rotation.z=-.42,d.rotation.y=-.18,n.add(d)}return n}function z3(){const n=new Ae,t=new Ze({color:4608334,roughness:.76,metalness:.12}),e=new Pn({color:10401197,transparent:!0,opacity:.2}),i=new de({color:7598035,transparent:!0,opacity:.78}),r=[new T(-150,.1,-125),new T(155,.1,-125),new T(185,.1,130),new T(-180,.1,145)];for(let s=0;s<r.length;s++){const o=r[s],a=r[(s+1)%r.length],c=o.distanceTo(a),l=Math.floor(c/18);for(let u=0;u<=l;u++){const h=u/l,d=o.clone().lerp(a,h),f=new mt(new pi(.18,.22,2.2,6),t);if(f.position.set(d.x,1.1,d.z),n.add(f),u%4===0){const g=new mt(new cn(.5,.18,.5),i);g.position.set(d.x,2.36,d.z),n.add(g)}}for(const u of[1,1.7])n.add(new Un(new Ee().setFromPoints([new T(o.x,u,o.z),new T(a.x,u,a.z)]),e))}return n}function V3(){const n=new Ae,t=new de({color:16773572,transparent:!0,opacity:.018,depthWrite:!1,side:on});for(const[e,i,r]of[[-132,118,-.65],[152,110,.82]]){const s=new mt(new pi(.7,1.1,5.5,8),new Ze({color:2831667,roughness:.76,metalness:.14}));s.position.set(e,2.75,i);const o=new mt(new Qs(10,110,4,1,!0),t);o.position.set(e,28,i),o.rotation.x=Math.PI*.5,o.rotation.z=r,o.scale.x=.28,Xo.push(o),n.add(s,o)}return n}function k3(){const n=new Ae,t=new Pn({color:12179146,transparent:!0,opacity:.46}),e=new de({color:14134613,transparent:!0,opacity:.86});for(const[i,r,s]of[[-120,88,34],[112,-96,28],[142,132,42]]){const o=new Un(new Ee().setFromPoints([new T(i,0,r),new T(i,s,r)]),t),a=new Un(new Ee().setFromPoints([new T(i-4,s-3,r),new T(i+4,s-3,r)]),t),c=new mt(new cn(1.1,.8,1.1),e);c.position.set(i,s,r),Xm.push(e),n.add(o,a,c)}return n}function H3(){const n=new Ae,t=Zo(7721),e=new Gd(new pi(.18,.26,1.4,5),new Ze({color:4535847,roughness:.9}),90),i=new Gd(new Qs(1.25,3.8,7),new Ze({color:1517855,roughness:.96}),90),r=new Ke;for(let s=0;s<90;s++){const o=s%3,a=o===0?-260+t()*520:(t()<.5?-250:250)+(t()-.5)*16,c=o===0?210+(t()-.5)*34:-180+t()*370,l=.65+t()*.72;r.position.set(a,.7*l,c),r.rotation.y=t()*Math.PI*2,r.scale.setScalar(l),r.updateMatrix(),e.setMatrixAt(s,r.matrix),r.position.set(a,2.35*l,c),r.rotation.y=t()*Math.PI*2,r.scale.setScalar(l),r.updateMatrix(),i.setMatrixAt(s,r.matrix)}return e.instanceMatrix.needsUpdate=!0,i.instanceMatrix.needsUpdate=!0,n.add(e,i),n}function G3(){const n=new Ae,t=new Ze({color:6911835,roughness:.98,metalness:.01}),e=new Pn({color:10135700,transparent:!0,opacity:.34}),i=Zo(1247);for(let r=0;r<4;r++){const s=-230+r*58,o=[];o.push(new T(-290,-.02,s+55));for(let h=0;h<=18;h++){const d=-290+h/18*580,f=3+r*1.8+i()*8;o.push(new T(d,f,s+Math.sin(h*.85+r)*18))}o.push(new T(290,-.02,s+55));const a=new _h(o.map(h=>new ft(h.x,h.z))),c=new Nc(a),l=new mt(c,t);l.rotation.x=-Math.PI/2,l.position.y=-.12-r*.01,l.renderOrder=-4,n.add(l);const u=new Un(new Ee().setFromPoints(o.slice(1,-1)),e);n.add(u)}return n}function Zo(n){return()=>{n|=0,n=n+1831565813|0;let t=Math.imul(n^n>>>15,1|n);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function Th(n,t){const e=new Ee;return e.setAttribute("position",new wn(new Float32Array(6),3)),new Un(e,new Pn({color:n,transparent:!0,opacity:t}))}function W3(){const n=new Ae,t=new Ze({color:15919836,roughness:.42,metalness:.32}),e=new Ze({color:14261048,roughness:.46,metalness:.16}),i=new Ze({color:1185558,roughness:.5,metalness:.28}),r=new de({color:12124144,transparent:!0,opacity:.22,depthWrite:!1}),s=new de({color:7329989}),o=new de({color:0,transparent:!0,opacity:.22,depthWrite:!1}),a=new mt(new cn(3.8,.75,2.2),t);n.add(a);const c=new mt(new Qs(.7,1.4,4),e);c.rotation.z=-Math.PI/2,c.position.x=2.6,n.add(c);const l=new cn(7.8,.18,.18),u=new mt(l,t);u.rotation.y=Math.PI/4;const h=new mt(l,t);h.rotation.y=-Math.PI/4,n.add(u,h);for(const g of[-1,1])for(const _ of[-1,1]){const m=new mt(new pi(1.25,1.25,.05,32),i);m.position.set(g*3.3,.18,_*3.3),m.scale.z=.32;const p=new mt(new Wr(1.45,36),r);p.rotation.x=-Math.PI/2,p.position.copy(m.position),p.position.y+=.05,Ah.push(p),n.add(m,p)}const d=new mt(new Sr(.18,12,8),s);d.position.set(-1.75,.54,0);const f=new mt(new Wr(3.6,40),o);return f.rotation.x=-Math.PI/2,f.position.y=-.46,n.add(d,f),n}async function X3(){const n=new URLSearchParams(window.location.search).get("src"),t=n??"/flights/nav-default.arrow",e=n??"public/flights/nav-default.arrow";try{const i=await fetch(t,{cache:"no-store"});if(!i.ok)throw new Error(`${i.status} ${i.statusText}`);await q3(i,e)}catch(i){Jm(n?`Não foi possível carregar ${e}. Verifique o endpoint e o CORS.`:"Ainda não há arquivo Arrow padrão. Solte um .arrow ou execute o exportador.",i)}}async function q3(n,t){const e=await Y3(n,(i,r)=>{const s=r?` · ${Math.round(i/r*100)}%`:"";Sh.textContent=`${t}
carregando ${(i/1048576).toFixed(1)} MB${s}`});jm(e.buffer.slice(e.byteOffset,e.byteOffset+e.byteLength),t)}function jm(n,t){const e=new Uint8Array(n),i=V0(e);$t=$3(i,t,e.byteLength),Mi=0,K3($t),nA($t),J3($t)}async function Y3(n,t){const e=Number(n.headers.get("content-length"))||null,i=n.body?.getReader();if(!i){const c=new Uint8Array(await n.arrayBuffer());return t(c.byteLength,c.byteLength),c}const r=[];let s=0;for(;;){const{value:c,done:l}=await i.read();if(l)break;c&&(r.push(c),s+=c.byteLength,t(s,e))}const o=new Uint8Array(s);let a=0;for(const c of r)o.set(c,a),a+=c.byteLength;return o}function $3(n,t,e){const i=h=>{const d=n.getChild(h);if(!d)throw new Error(`missing Arrow column ${h}`);return Pf(d,Float32Array,h)},s=(h=>{const d=n.getChild(h);if(!d)throw new Error(`missing Arrow column ${h}`);return Pf(d,Float64Array,h)})("t");if(s.length<2)throw new Error("O voo Arrow precisa de pelo menos duas linhas");const o=i("px"),a=i("py"),c=i("pz"),l=j3(o,a,c);return{label:t,bytes:e,t:s,ax:i("ax"),ay:i("ay"),az:i("az"),px:o,py:a,pz:c,vx:i("vx"),vy:i("vy"),vz:i("vz"),gx:n.getChild("gx")?i("gx"):void 0,gy:n.getChild("gy")?i("gy"):void 0,gz:n.getChild("gz")?i("gz"):void 0,length:s.length,duration:s[s.length-1]-s[0],bounds:l}}function Pf(n,t,e){if(n.data.length===1){const r=n.data[0].values;if(r instanceof t)return r}const i=n.toArray();if(i instanceof t)return i;throw new Error(`Arrow column ${e} is not ${t.name}`)}function j3(n,t,e){let i=1/0,r=-1/0,s=1/0,o=-1/0,a=1/0,c=-1/0;const l=Math.max(1,Math.floor(n.length/4e3));for(let g=0;g<n.length;g+=l)i=Math.min(i,n[g]),r=Math.max(r,n[g]),s=Math.min(s,-t[g]),o=Math.max(o,-t[g]),a=Math.min(a,e[g]),c=Math.max(c,e[g]);const u=(i+r)*.5,h=(s+o)*.5,d=Math.max(r-i,o-s,c-a,.5),f=he.clamp(_3/d,.04,80);return{cx:u,cz:h,minH:a,scale:f,radius:Math.max(r-i,o-s,.5)*.5*f}}function J3(n){Sh.innerHTML=`${n.label}<br>${n.length.toLocaleString("pt-BR")} linhas · ${n.duration.toFixed(1)} s · ${(n.bytes/1048576).toFixed(1)} MB · Arrow IPC`}function Jm(n,t){console.error(t??n),Sh.textContent=n}function K3(n){if(fr){yn.remove(fr),fr.geometry.dispose();const g=fr.material;Array.isArray(g)||g.dispose()}if(pr){yn.remove(pr),pr.geometry.dispose();const g=pr.material;Array.isArray(g)||g.dispose()}if(Xi){yn.remove(Xi),Xi.geometry.dispose();const g=Xi.material;Array.isArray(g)||g.dispose()}for(const g of[ws,As])g&&yn.remove(g);const t=Math.max(1,Math.floor(n.length/y3)),e=Math.max(1,Math.floor(t*3)),i=Math.ceil(n.length/t),r=new Float32Array(i*3),s=new Float32Array(i*3),o=new Zt(7858897),a=new Zt(14134613),c=new Zt;let l=0,u=0;for(let g=0;g<n.length;g+=t){const _=Km(n.px,n.py,n.pz,g,e);r[l++]=_.x,r[l++]=_.y,r[l++]=_.z,c.copy(o).lerp(a,n.length>1?g/(n.length-1):0),s[u++]=c.r,s[u++]=c.g,s[u++]=c.b}const h=new Ee;h.setAttribute("position",new wn(r.subarray(0,l),3)),h.setAttribute("color",new wn(s.subarray(0,u),3));const d=h.clone();pr=new Un(d,new Pn({color:14134613,transparent:!0,opacity:.08})),fr=new Un(h,new Pn({vertexColors:!0,transparent:!0,opacity:.68})),yn.add(pr),yn.add(fr),Xi=Z3(n,t,e),Xi&&yn.add(Xi),ws=Uf(7858897),As=Uf(14134613),ws.position.copy(Wo(n.px[0],n.py[0],n.pz[0]));const f=n.length-1;As.position.copy(Wo(n.px[f],n.py[f],n.pz[f])),yn.add(ws,As),Ch()}function Z3(n,t,e){if(!n.gx||!n.gy||!n.gz)return null;const i=Math.ceil(n.length/t),r=new Float32Array(i*3);let s=0;for(let a=0;a<n.length;a+=t){const c=Km(n.gx,n.gy,n.gz,a,e);r[s++]=c.x,r[s++]=c.y+.14,r[s++]=c.z}const o=new Ee;return o.setAttribute("position",new wn(r.subarray(0,s),3)),new Un(o,new Pn({color:14411986,transparent:!0,opacity:.24}))}function Km(n,t,e,i,r){const s=Math.max(0,i-r),o=Math.min(n.length-1,i+r);let a=0,c=0,l=0,u=0;for(let h=s;h<=o;h++)a+=n[h],c+=t[h],l+=e[h],u++;return Wo(a/u,c/u,l/u)}function Uf(n){const t=new Ae,e=new de({color:n,transparent:!0,opacity:.82}),i=new mt(new Ko(1.4,1.75,40),e);i.rotation.x=-Math.PI/2;const r=new mt(new pi(.05,.05,4,8),e);return r.position.y=2,t.add(i,r),t}function Ch(){fr&&(fr.visible=dn.trajectory),pr&&(pr.visible=dn.trajectory),Xi&&(Xi.visible=dn.trajectory),ws&&(ws.visible=dn.trajectory),As&&(As.visible=dn.trajectory),Hc.visible=dn.vectors,Gc.visible=dn.vectors,kc.visible=dn.vectors,Wa.style.opacity=dn.vectors?"":"0",$m.visible=dn.airspace,Vc.visible=dn.airspace,Ym.visible=dn.range}function Rh(){for(const n of km)n.setAttribute("aria-pressed",String(n.dataset.camera===pn))}function Zm(){for(const n of Hm){const t=n.dataset.layer;t&&n.setAttribute("aria-pressed",String(dn[t]))}}function Qm(){S3.textContent=`${Number(Mh.value).toFixed(2).replace(/\.00$/,"")}x`}function tg(){b3.classList.toggle("presentation",Co),Fu.setAttribute("aria-pressed",String(Co)),Fu.textContent=Co?"Sair":"Apresentação"}function Q3(n){if(!$t)return 0;let t=0,e=1/0;const i=Math.max(1,Math.floor($t.length/800));for(let r=0;r<$t.length;r+=i){const o=Wo($t.px[r],$t.py[r],$t.pz[r]).distanceToSquared(n);o<e&&(e=o,t=r)}return $t.t[t]-$t.t[0]}function eg(){return{fix:Hn.hasFix?"3d":"none",satellites:Hn.sats,jammed:Hn.active,hdop:Hn.epu}}function qa(n){if(n===je)return;const t=je==="manual"||je==="manual-jammed",e=n==="manual"||n==="manual-jammed";!t&&e&&($t?Xa.copy(sn.position):Xa.set(0,20/Math.max(tr,.001),0),Vn.reset(Xa.clone())),n==="manual-jammed"?(Hn.setActive(!0),Hn.setIntensity(.65)):Hn.setActive(!1),t&&!e&&$t&&(Mi=Q3(sn.position),Tc.value=String(Mi/$t.duration)),je=n,yh(n)}function tA(){const n=["chase","orbit","top","command","fpv"],t=n.indexOf(pn);pn=n[(t+1)%n.length],Rh()}function eA(n){if(n.reset&&(n.reset=!1,je!=="demo"&&Vn.reset(Xa.clone())),n.cycleCamera&&(n.cycleCamera=!1,tA()),n.toggleJam&&(n.toggleJam=!1,je==="manual"?qa("manual-jammed"):je==="manual-jammed"&&qa("manual")),n.toggleMode){n.toggleMode=!1;const t=["demo","manual","manual-jammed"],e=t.indexOf(je);qa(t[(e+1)%t.length])}n.pause&&(n.pause=!1,je==="demo"&&(_r=!_r,Ec.textContent=_r?"Pausar":"Retomar")),n.toggleHelp&&(n.toggleHelp=!1,Df&&(Df.getAttribute("aria-hidden")!=="false"?bh():Uu()))}function nA(n){tr=n.bounds.scale,Im=n.px[0],Dm=-n.py[0],Lm=n.bounds.minH,yn.position.set(0,0,0),di=he.clamp(n.bounds.radius*1.9,80,440)}function iA(n,t){const e=n.t[0]+t;let i=0,r=n.length-1;for(;i<r;){const s=i+r>>1;n.t[s]<e?i=s+1:r=s}return Math.min(n.length-1,Math.max(0,i))}function rA(n){if(!$t)return;_r?(Mi=(Mi+n*Number(Mh.value))%Math.max(.001,$t.duration),Tc.value=String(Mi/$t.duration)):Mi=Number(Tc.value)*$t.duration;const t=iA($t,Mi),e=Wo($t.px[t],$t.py[t],$t.pz[t]);sn.position.copy(e),Vc.position.set(e.x,.02,e.z),sg(sn,$t.pz[t]);const i=new T($t.vx[t],$t.vz[t],-$t.vy[t]);if(i.lengthSq()>1e-4){const s=Math.atan2(i.x,i.z);sn.rotation.set(0,s,0),sn.rotation.z=he.clamp(-$t.ax[t]*.05,-.45,.45),sn.rotation.x=he.clamp($t.ay[t]*.05,-.35,.35)}const r=new T($t.ax[t],$t.az[t],-$t.ay[t]);Ps(Hc,e,i,tr*.9),Ps(Gc,e,r,tr*.5),Ps(kc,new T(e.x,.03,e.z),new T(0,e.y,0),1);for(const s of Ah)s.rotation.z+=n*42;if(og(i,r),pn==="chase"){const s=i.lengthSq()>.001?i.clone().normalize().multiplyScalar(-58):new T(-46,0,-46),o=e.clone().add(s).add(new T(0,28,0));Ne.position.lerp(o,.045),Ne.lookAt(e.x,e.y+4,e.z)}else if(pn==="orbit"){const s=e.clone().add(new T(0,3.5,0)),o=Math.cos(qs),a=new T(Math.sin(qo)*o*di,Math.sin(qs)*di,Math.cos(qo)*o*di);Ne.position.lerp(s.clone().add(a),.12),Ne.lookAt(s)}else if(pn==="top"){const s=e.clone(),o=he.clamp(di*1.45,95,520);Ne.position.lerp(new T(e.x,o,e.z+.01),.09),Ne.lookAt(s)}else if(pn==="fpv"){const s=new T(1.2,.7,0).applyQuaternion(sn.quaternion),o=e.clone().add(s);Ne.position.lerp(o,.2),Ne.quaternion.slerp(sn.quaternion,.15)}else{const s=e.clone().add(new T(0,5,0));Ne.position.lerp(new T(-118,54,-96),.045),Ne.lookAt(s)}cA($t,t,i),Pm.innerHTML=`<dl>
    <dt>tempo</dt><dd>${Mi.toFixed(2)} s</dd>
    <dt>posição</dt><dd>${$t.px[t].toFixed(1)}, ${$t.py[t].toFixed(1)}, ${$t.pz[t].toFixed(1)} m</dd>
    <dt>velocidade</dt><dd>${Math.hypot($t.vx[t],$t.vy[t],$t.vz[t]).toFixed(2)} m/s</dd>
    <dt>acel.</dt><dd>${Math.hypot($t.ax[t],$t.ay[t],$t.az[t]).toFixed(2)} m/s²</dd>
  </dl>`,Rm(eg())}function sA(n,t){const e=Vn.velocity.clone(),i=t.boost?1:t.throttle;if(Vn.step({throttle:i,roll:t.roll,pitch:t.pitch,yaw:t.yaw,boost:t.boost,brake:t.brake,reset:!1,toggleJam:!1,toggleMode:!1,cycleCamera:!1,pause:!1,toggleHelp:!1},n),t.brake){const a=Math.max(0,1-5*n);Vn.velocity.multiplyScalar(a)}je==="manual-jammed"&&Hn.update(Vn.position,Vn.velocity,n);const r=je==="manual-jammed"?Hn.reportedPosition:Vn.position,s=je==="manual-jammed"?Hn.reportedVelocity:Vn.velocity;sn.position.copy(r),Vc.position.set(r.x,.02,r.z),sg(sn,r.y),sn.quaternion.copy(Vn.quaternion);const o=Vn.velocity.clone().sub(e).divideScalar(Math.max(n,1e-4));Ps(Hc,r,s,tr*.9),Ps(Gc,r,o,tr*.5),Ps(kc,new T(r.x,.03,r.z),new T(0,r.y,0),1);for(const a of Ah)a.rotation.z+=n*42*(.5+i*.8);og(s,o),oA(),aA(s),Pm.innerHTML=`<dl>
    <dt>modo</dt><dd>${je==="manual"?"manual":"manual + jam"}</dd>
    <dt>posição</dt><dd>${r.x.toFixed(1)}, ${r.y.toFixed(1)}, ${r.z.toFixed(1)} m</dd>
    <dt>velocidade</dt><dd>${s.length().toFixed(2)} m/s</dd>
    <dt>acel.</dt><dd>${o.length().toFixed(2)} m/s²</dd>
  </dl>`,Rm(eg())}function oA(n){const t=sn.position,e=je==="manual-jammed"?Hn.reportedVelocity:Vn.velocity;if(pn==="chase"){const i=e.lengthSq()>.001?e.clone().normalize().multiplyScalar(-58):new T(-46,0,-46),r=t.clone().add(i).add(new T(0,28,0));Ne.position.lerp(r,.045),Ne.lookAt(t.x,t.y+4,t.z)}else if(pn==="orbit"){const i=t.clone().add(new T(0,3.5,0)),r=Math.cos(qs),s=new T(Math.sin(qo)*r*di,Math.sin(qs)*di,Math.cos(qo)*r*di);Ne.position.lerp(i.clone().add(s),.12),Ne.lookAt(i)}else if(pn==="top"){const i=t.clone(),r=he.clamp(di*1.45,95,520);Ne.position.lerp(new T(t.x,r,t.z+.01),.09),Ne.lookAt(i)}else if(pn==="fpv"){const i=new T(1.2,.7,0).applyQuaternion(sn.quaternion),r=t.clone().add(i);Ne.position.lerp(r,.2),Ne.quaternion.slerp(sn.quaternion,.15)}else{const i=t.clone().add(new T(0,5,0));Ne.position.lerp(new T(-118,54,-96),.045),Ne.lookAt(i)}}function aA(n){const t=n.length(),e=t>1?"tracking":"acquisition",i=je==="manual-jammed"?Vn.position.distanceTo(Hn.reportedPosition):null,r=je==="manual-jammed"?Math.round(he.clamp(99-Hn.intensity*35,60,99)):98;Nm.textContent=Cc(e),Bm.textContent=`${t.toFixed(1)} m/s`,Om.textContent=`${sn.position.y.toFixed(1)} m`,zm.textContent=i==null?"--":`${i.toFixed(1)} m`,Vm.textContent=`${r}%`,Fm.textContent=`${Cc(e)}: ${ng(e)} Câmera ${ig(pn)}; camadas visíveis: ${rg()}.`,document.documentElement.style.setProperty("--track-energy",String(.22+Math.min(t/16,.55)))}function cA(n,t,e){const i=Mi/Math.max(.001,n.duration),r=i<.08?"acquisition":i<.68?"tracking":i<.9?"assessment":"recovery",s=Math.hypot(n.vx[t],n.vy[t],n.vz[t]),o=n.gx&&n.gy&&n.gz?Math.hypot(n.px[t]-n.gx[t],n.py[t]-n.gy[t],n.pz[t]-n.gz[t]):null,a=he.clamp(99-lA(n,t)*3.8-i*4,86,99);Nm.textContent=Cc(r),Bm.textContent=`${s.toFixed(1)} m/s`,Om.textContent=`${n.pz[t].toFixed(1)} m`,zm.textContent=o==null?"sem verdade":`${o.toFixed(1)} m`,Vm.textContent=`${Math.round(a)}%`,Fm.textContent=`${Cc(r)}: ${ng(r)} Câmera ${ig(pn)}; camadas visíveis: ${rg()}.`,document.documentElement.style.setProperty("--track-energy",String(.22+Math.min(e.length()/16,.55)))}function lA(n,t){return Math.min(3,Math.hypot(n.ax[t],n.ay[t],n.az[t])/9.81)}function Cc(n){return n==="acquisition"?"Aquisição":n==="tracking"?"Rastreamento":n==="assessment"?"Avaliação":"Recuperação"}function ng(n){return n==="acquisition"?"estabelecer enlace de telemetria e alinhar a solução inercial.":n==="tracking"?"monitorar trajetória, vetores de aceleração e camadas de segurança do campo.":n==="assessment"?"avaliar o comportamento do erro de navegação contra a verdade disponível.":"encerrar o voo, preservar evidências e preparar o pacote da execução."}function ig(n){return n==="chase"?"Cauda":n==="orbit"?"Órbita":n==="top"?"Topo":n==="fpv"?"FPV":"Comando"}function rg(){const n={trajectory:"trajetória",vectors:"vetores",airspace:"espaço aéreo",range:"campo"};return Object.entries(dn).filter(([,t])=>t).map(([t])=>n[t]).join(", ")}function sg(n,t){const e=n.children[n.children.length-1],i=he.clamp(1+t*.035,1,3.8);e.scale.set(i,i,i);const r=e.material;r.opacity=he.clamp(.28-t*.006,.05,.24)}function Ps(n,t,e,i){const r=n.geometry.getAttribute("position"),s=t.clone().add(e.clone().multiplyScalar(i));r.setXYZ(0,t.x,t.y,t.z),r.setXYZ(1,s.x,s.y,s.z),r.needsUpdate=!0}function og(n,t){const e=n.length(),i=he.clamp(t.x*4.5,-24,24),r=he.clamp(n.y*5,-18,18);Wa.style.setProperty("--bank",`${i}deg`),Wa.style.setProperty("--climb",`${r}px`),Wa.style.setProperty("--pulse",String(.38+Math.min(e/18,.42)))}function uA(n){for(let e=0;e<Xo.length;e++){const i=Xo[e];i.rotation.y+=.0025+e*8e-4,i instanceof mt&&i.geometry instanceof Qs&&(i.rotation.z+=Math.sin(n*.45+e)*8e-4)}const t=.62+Math.sin(n*3.2)*.22;for(const e of Xm)e.opacity=t}function ag(){const n=window.innerWidth,t=window.innerHeight;zc.setSize(n,t,!1),Ne.aspect=n/t,Ne.updateProjectionMatrix()}function cg(n){const t=Math.min(.05,(n-Rf)/1e3);Rf=n;const e=If.sample();eA(e),je==="demo"?rA(t):sA(t,e),m3(If.connectedGamepad),uA(n/1e3),zc.render(ni,Ne),Eh=requestAnimationFrame(cg)}window.addEventListener("resize",ag);Ec.addEventListener("click",()=>{_r=!_r,Ec.textContent=_r?"Pausar":"Retomar"});for(const n of km)n.addEventListener("click",()=>{const t=n.dataset.camera;t&&(pn=t,Rh())});for(const n of Hm)n.addEventListener("click",()=>{const t=n.dataset.layer;t&&(dn[t]=!dn[t],Zm(),Ch())});Fu.addEventListener("click",()=>{Co=!Co,tg()});Mh.addEventListener("input",Qm);Tc.addEventListener("input",()=>{_r=!1,Ec.textContent="Retomar"});x3(n=>qa(n));try{localStorage.getItem("uav-help-seen")||(bh(),localStorage.setItem("uav-help-seen","1"))}catch{}for(const n of["dragenter","dragover"])window.addEventListener(n,t=>{t.preventDefault(),Um.classList.add("hot")});for(const n of["dragleave","drop"])window.addEventListener(n,()=>Um.classList.remove("hot"));window.addEventListener("drop",async n=>{n.preventDefault();const t=n.dataTransfer?.files[0];if(t)try{jm(await t.arrayBuffer(),t.name)}catch(e){Jm(`Não foi possível carregar ${t.name}`,e)}});Xs.addEventListener("pointerdown",n=>{pn==="orbit"&&je==="demo"&&(qi={id:n.pointerId,x:n.clientX,y:n.clientY},Xs.setPointerCapture(n.pointerId))});Xs.addEventListener("pointermove",n=>{if(!qi||qi.id!==n.pointerId)return;const t=n.clientX-qi.x,e=n.clientY-qi.y;qi.x=n.clientX,qi.y=n.clientY,qo-=t*.006,qs=he.clamp(qs+e*.004,.12,1.15)});Xs.addEventListener("pointerup",n=>{qi?.id===n.pointerId&&(qi=null)});Xs.addEventListener("wheel",n=>{pn==="orbit"&&je==="demo"&&(n.preventDefault(),di=he.clamp(di*(1+n.deltaY*.001),24,900))},{passive:!1});window.addEventListener("beforeunload",()=>cancelAnimationFrame(Eh));ag();Rh();Zm();Qm();tg();Ch();yh(je);X3();Eh=requestAnimationFrame(cg);
