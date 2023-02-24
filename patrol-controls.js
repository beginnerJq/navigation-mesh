import{Vector3 as t,Matrix4 as i,Euler as e}from"three";function s(t,i,e,s){return new(e||(e=Promise))((function(o,n){function a(t){try{h(s.next(t))}catch(t){n(t)}}function r(t){try{h(s.throw(t))}catch(t){n(t)}}function h(t){var i;t.done?o(t.value):(i=t.value,i instanceof e?i:new e((function(t){t(i)}))).then(a,r)}h((s=s.apply(t,i||[])).next())}))}const o="patrolControls";class n{constructor(t){this.ssp=t,this.options={naviSpeed:1,rotateSpeed:1,eyeHeight:150,flyToStartPoint:!0,onUpdate:()=>{},onProgress:()=>{},onEnd:()=>{}},this.states={moveDuration:0,rotateDuration:0},this.nodes=[],this.nextPointIndex=0,this._nodeDistances=[],this._totalDistance=0,this._updatePercent=0,this._needsUpdateProgress=!1,this.isPaused=!1,this.isStoped=!0,this._positionTween=null,this._rotationTween=null,this._cameraViewpointData=null,this._mainCameraViewpointData=null,this.camera=this.ssp.viewport.camera}start(t,i){this.isStoped?(this.init(t),this.initOptions(i),this.patrolStart()):this.ssp.utils.warn("巡检已经开始！")}setProgress(t){var i,e;this._updatePercent=Math.min(Math.max(t,0),1),this._needsUpdateProgress=!0,null===(i=this._positionTween)||void 0===i||i.stop(),null===(e=this._rotationTween)||void 0===e||e.stop()}setOptions(t){if(this.isStoped)return;const{naviSpeed:i,rotateSpeed:e}=t;if(i&&this._positionTween){const t=this.states.moveDuration*this.options.naviSpeed/i;this._positionTween.duration(t),this.states.moveDuration=t}if(e&&this._rotationTween){const t=this.states.rotateDuration*this.options.rotateSpeed/e;this._rotationTween.duration(t),this.states.rotateDuration=t}this.initOptions(t)}pause(){var t,i;if(this.isPaused||this.isStoped)return;this._cameraViewpointData=this.ssp.getCameraViewpoint();const{cameraManager:e}=this.ssp.viewport,s=e.getMainCamera();e.setCurrentCamera(s),this._cameraViewpointData&&this.ssp.setCameraViewpoint(this._cameraViewpointData),this.ssp.viewport.controls.currentControls.enabled=!1,this.isPaused=!0,null===(t=this._positionTween)||void 0===t||t.pause(),null===(i=this._rotationTween)||void 0===i||i.pause()}resume(){var t,i;if(this.isPaused&&!this.isStoped){if(this._cameraViewpointData){const{cameraManager:t}=this.ssp.viewport;t.setCurrentCamera(this.camera),this.ssp.setCameraViewpoint(this._cameraViewpointData)}this.isPaused=!1,null===(t=this._positionTween)||void 0===t||t.resume(),null===(i=this._rotationTween)||void 0===i||i.resume()}}stop(){if(this.isStoped)return;this.patrolStop();const{cameraManager:t}=this.ssp.viewport,i=t.getMainCamera();t.setCurrentCamera(i),this._mainCameraViewpointData&&this.ssp.setCameraViewpoint(this._mainCameraViewpointData),this.ssp.viewport.controls.currentControls.enabled=!0}init(t){const{cameraManager:i}=this.ssp.viewport;this.isPaused=!1,this.isStoped=!1,this.nextPointIndex=0,this._mainCameraViewpointData=this.ssp.getCameraViewpoint(),this.camera=i.cameras[o]||i.createCamera(o),i.setCurrentCamera(this.camera),this.ssp.setCameraViewpoint(this._mainCameraViewpointData),this.nodes=[...t.nodes]}initOptions(i){const{eyeHeight:e,naviSpeed:s,rotateSpeed:o,flyToStartPoint:n=!0,onUpdate:a,onProgress:r,onEnd:h}=i;e&&(this.options.eyeHeight=e),s&&(this.options.naviSpeed=s),o&&(this.options.rotateSpeed=o),this.options.flyToStartPoint=n,a&&(this.options.onUpdate=a),r&&(this.options.onProgress=r),h&&(this.options.onEnd=h),this._nodeDistances.length=0,this._nodeDistances.push(0),this._totalDistance=0;for(let i=0,e=this.nodes.length;i<e-1;i++){const e=this.nodes[i],s=this.nodes[i+1];if(e&&s){const i=e.getWorldPosition(new t),o=s.getWorldPosition(new t);i.y+=this.options.eyeHeight,o.y+=this.options.eyeHeight;const n=i.distanceTo(o);this._nodeDistances.push(n),this._totalDistance+=n}}}computedRotation(t,s){const o=new i;o.lookAt(t,s,this.camera.up);const n=(new e).setFromRotationMatrix(o,"YXZ");return n.copy(this.ssp.utils.rotationAFix(this.camera.rotation,n.clone())),0===n.y&&(0===n.z?n.x=0:0===n.x&&(n.z=0)),n}computeNextRotation(){let i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.nextPointIndex;var s,o;const n=null===(s=this.nodes[i])||void 0===s?void 0:s.getWorldPosition(new t),a=null===(o=this.nodes[i+1])||void 0===o?void 0:o.getWorldPosition(new t);return n&&a?this.computedRotation(n,a):new e}patrolStart(){return s(this,void 0,void 0,(function*(){return new Promise((i=>s(this,void 0,void 0,(function*(){const{onUpdate:e,onProgress:s,onEnd:o}=this.options;if(this.nextPointIndex>=this.nodes.length)null==o||o(this.camera.position.clone()),i(!0);else{if(this._needsUpdateProgress){let i=this._totalDistance*this._updatePercent;for(let e=0,s=this._nodeDistances.length;e<s;e++)if(i-=this._nodeDistances[e],i<0){this.nextPointIndex=e,i+=this._nodeDistances[e];const s=i/this._nodeDistances[e]||0,o=this.nodes[e-1],n=this.nodes[e],a=new t,r=o.getWorldPosition(new t),h=n.getWorldPosition(new t);r.y+=this.options.eyeHeight,h.y+=this.options.eyeHeight;const p=(new t).subVectors(h,r).multiplyScalar(s);a.copy(r).add(p),this.camera.position.copy(a),this.camera.rotation.copy(this.computeNextRotation(e-1));break}this._needsUpdateProgress=!1}const i=this.camera.position.clone(),o=this.computeNextRotation(),n=this.nodes[this.nextPointIndex],a=n.getWorldPosition(new t);a.setY(a.y+this.options.eyeHeight);const r=i.distanceTo(a);if(this.states.moveDuration=0===this.nextPointIndex?1e3:r/this.options.naviSpeed/.6,0!==this.nextPointIndex||this.options.flyToStartPoint)try{yield this.ssp.animation(this.camera.position,a,{duration:this.states.moveDuration},(t=>{var i;this.isPaused&&(null===(i=this._positionTween)||void 0===i||i.pause());const r=this.camera.position.distanceTo(a);if(null==e||e(t,o,n,r),this._nodeDistances[this.nextPointIndex]>0){let t=this._nodeDistances.slice(0,this.nextPointIndex+1).reduce(((t,i)=>t+i),0);t-=r,null==s||s({patrolled:t,total:this._totalDistance,percent:t/this._totalDistance})}}),(t=>{this._positionTween=t}))}catch(t){}else this.camera.position.copy(a);if(this.nextPointIndex<this.nodes.length-1){const t=this.camera.rotation.clone(),i=this.computeNextRotation(),e=Math.abs(t.x-i.x)+Math.abs(t.y-i.y)+Math.abs(t.y-i.y);if(this.states.rotateDuration=0===this.nextPointIndex?1e3:100*e/this.options.rotateSpeed,0!==this.nextPointIndex||this.options.flyToStartPoint)try{yield this.ssp.animation(this.camera.rotation,i,{duration:this.states.rotateDuration},((t,i)=>{var e;this.isPaused&&(null===(e=this._rotationTween)||void 0===e||e.pause())}),(t=>{this._rotationTween=t}))}catch(t){}else this.camera.rotation.copy(i)}this._needsUpdateProgress||this.nextPointIndex++,this.isStoped||(yield this.patrolStart())}}))))}))}patrolStop(){var t,i;this.options={naviSpeed:1,rotateSpeed:1,eyeHeight:150,flyToStartPoint:!0,onUpdate:()=>{},onProgress:()=>{},onEnd:()=>{}},this.nodes=[],this.nextPointIndex=0,this.isPaused=!1,this.isStoped=!0,this._needsUpdateProgress=!1,null===(t=this._positionTween)||void 0===t||t.stop(),null===(i=this._rotationTween)||void 0===i||i.stop(),this._positionTween=null,this._rotationTween=null}}export{n as default};
