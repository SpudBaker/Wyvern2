"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[4611],{4611:(f,g,i)=>{i.r(g),i.d(g,{GamesInPlayPageModule:()=>G});var u=i(6895),o=i(9772),P=i(4719),c=i(8342),l=i(3557),e=i(6738),d=i(9946),v=i(4547);function h(t,s){if(1&t){const n=e.EpF();e.TgZ(0,"div")(1,"ion-row"),e._UZ(2,"ion-col",6),e.TgZ(3,"ion-col",7)(4,"ion-button",8),e.NdJ("click",function(){const m=e.CHM(n).$implicit,I=e.oxw();return e.KtG(I.gameButtonPress(m))}),e._uU(5),e.qZA()(),e._UZ(6,"ion-col",6),e.qZA()()}if(2&t){const n=s.$implicit,a=e.oxw();e.xp6(5),e.Oqu(a.getButtonText(n))}}const y=[{path:"",component:(()=>{class t{constructor(n,a,r){this.authService=n,this.gameService=a,this.router=r,this.gameService.getIncompleteGames().then(m=>{this.games=m})}getButtonText(n){let a;switch(n.gameState){case l.D2.WAITING_FOR_PLAYERS:a="Waiting for opponent";break;case l.D2.FINISHED:a="Finished";break;case l.D2.IN_PROGRESS:a="Game in Progress"}return a}gameButtonPress(n){this.gameService.gameInPlay=n,this.router.navigate(["game"])}}return t.\u0275fac=function(n){return new(n||t)(e.Y36(d.e),e.Y36(v.h),e.Y36(c.F0))},t.\u0275cmp=e.Xpm({type:t,selectors:[["app-gamesInPlay"]],decls:11,vars:2,consts:[[3,"translucent"],["slot","start"],["slot","icon-only"],["slot","icon-only","name","home",3,"click"],[1,"outerDiv"],[4,"ngFor","ngForOf"],["size","4"],["align","center"],["expand","block","color","primary",3,"click"]],template:function(n,a){1&n&&(e.TgZ(0,"ion-header",0)(1,"ion-toolbar")(2,"ion-buttons",1),e._UZ(3,"ion-icon",2),e.TgZ(4,"ion-icon",3),e.NdJ("click",function(){return a.gameService.navigateHome()}),e.qZA()(),e.TgZ(5,"ion-title"),e._uU(6," Games In Play "),e.qZA()()(),e.TgZ(7,"ion-content")(8,"div",4)(9,"ion-grid"),e.YNc(10,h,7,1,"div",5),e.qZA()()()),2&n&&(e.Q6J("translucent",!0),e.xp6(10),e.Q6J("ngForOf",a.games))},dependencies:[u.sg,o.YG,o.Sm,o.wI,o.W2,o.jY,o.Gu,o.gu,o.Nd,o.wd,o.sr],styles:[".outerDiv[_ngcontent-%COMP%]{width:90vw;height:70vh;margin:15vh auto}"]}),t})()}];let p=(()=>{class t{}return t.\u0275fac=function(n){return new(n||t)},t.\u0275mod=e.oAB({type:t}),t.\u0275inj=e.cJS({imports:[c.Bz.forChild(y),c.Bz]}),t})(),G=(()=>{class t{}return t.\u0275fac=function(n){return new(n||t)},t.\u0275mod=e.oAB({type:t}),t.\u0275inj=e.cJS({imports:[u.ez,P.u5,o.Pc,p]}),t})()}}]);