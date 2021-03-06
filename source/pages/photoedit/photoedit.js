// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { ClassApi } from "../../apis/class.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
   // options.class_id=1;
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  }
  onMyShow() {
    var that = this;
    var classapi = new ClassApi();
    classapi.photoeditlist({},(rlist)=>{
      var list=[];
      for (var i = 0; i < rlist.length&&i<10;i++){
        list.push(rlist[i]);
      }
      this.Base.setMyData({ list, rlist});
    });
  }
  onReachBottom() {
    var cs=0;
    var list = this.Base.getMyData().list;
    var rlist = this.Base.getMyData().rlist;
    for (var i = list.length; i < rlist.length ; i++) {
      cs++;
      if(cs<10){
        list.push(rlist[i]);
      }
    }
    this.Base.setMyData({ list});
  }
  updatestatus(e){
    var id=e.currentTarget.id.split("_");
    console.log(id);
    var idx = parseInt(id[0]);
    var status=id[1];
    var list=this.Base.getMyData().list;
    var photo=list[idx];
    var api=new ClassApi();
    api.photostatus({
      id:photo.id,
      status:status
    },()=>{
      list[idx].status = status == 'A' ? "A" : "I";
      list[idx].status_name = status == 'A' ? "启用" : "禁用";
      this.Base.setMyData({ list });
    },false);


  }
  videoplay(e) {
    console.log(e.currentTarget.id);
    var id = e.currentTarget.id;
    var videoContext = wx.createVideoContext(id);
    console.log("stop");
    videoContext.stop();
    var fv = id.split("_");

    var list = this.Base.getMyData().list;
    for (var i = 0; i < list.length; i++) {
      if(list[i].id==fv[1]){
        wx.navigateTo({
          url: '/pages/videoplay/videoplay?module=photo&file=' + list[i].video,
        });
        return;
      }
    }
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow; 
body.updatestatus = content.updatestatus;
body.videoplay = content.videoplay;
Page(body)