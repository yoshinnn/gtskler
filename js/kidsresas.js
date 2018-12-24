var baseUrl = 'https://opendata.resas-portal.go.jp/';
var apiKey = 'M1o2g9y0ORtM4StEcRPMBxiBwFr6lTPrZa9cXyJh';


google.charts.load('current', {packages: ['corechart', 'bar']});
var chart_div = document.getElementById("chart_div");

var prefnum;
var prefcode;
var prefname;
var citynum;
var citycode;
var cityname;
var scope;
var year;
var content;
var category;


function setCode() {

    prefnum = document.selbox.pref.selectedIndex;
    prefcode = document.selbox.pref.options[prefnum].value;
    prefname = document.selbox.pref.options[prefnum].innerText;
    citynum = document.selbox.city.selectedIndex;
    citycode = document.selbox.city.options[citynum].value;
    

}

function selectType(types) {


    //続けて項目を選択した時に、前に表示している地図を削除する
    var node = document.getElementById('chart_div');
    if(node != null){
	node.parentNode.removeChild(node);
	var node = document.getElementById('wrapper');
	node.parentNode.removeChild(node);

    }
    //canvasInitialize();
    
    //セレクタを作成、選択された項目のボタンを非表示から表示するよう変更
    var selector = "div#";
    console.log(types.length);
    for (var i = 0; i < types.length; i++) {
	console.log("i:"+i);
	if (i > 0) {
	    selector += "-";
	    console.log("types["+i+"]:"+types[i]);
	}
	selector += types[i];
	console.log("selector: "+selector);

    }
    
    $(selector).removeClass("hidden");    //hidden属性を削除することでボタンを表示する
    //removeSelector = selector;
    //続けて項目を選択された時に、前に選択されたボタンを非表示にする
    //例:1を選択して1-1,1-2,1-3,1-4のボタンが表示、続けて2を選択した時に前の1-1,1-2,1-3,1-4を表示されたままにしない    
    console.log("hidden: "+types);
    hiddenButtons(types);
    
    //console.log(removeSelector[0]);
    //$(removeSelector).removeClass("hidden");
    
    var container = document.getElementById("container");
    var rect = container.getBoundingClientRect();
    /*
      var cStart = $("#up").height();//rect.top + rect.height + window.pageYOffset;
      console.log("canvas開始位置:" + cStart);
      
      sizing(cStart);
    */
}


//続けて項目を選択された時に、前に選択されたボタンを非表示にする
function hiddenButtons (types) {

    var childrenNode = document.getElementsByClassName('container')[0].children;
    console.log(childrenNode);
    console.log(childrenNode.length);


    var typeID = "";
    for (var i = 0; i < types.length; i++) {
        if (i > 0) {
            typeID += "-";
            console.log("types["+i+"]:"+types[i]);
        }
        typeID += types[i];

    }

    console.log("typeID:"+typeID);    

    for (var i = 1; i < childrenNode.length; i++) {

	console.log("childNodeLength:"+childrenNode[i].classList.length);//2のときhidden
	var nodeID = String(childrenNode[i].id);
	console.log("nodeID:"+nodeID);
	if (childrenNode[i].classList.length < 2 && typeID.indexOf(nodeID) == -1) {
	    console.log("not hidden yet");
	    var selector = "div#" + nodeID;
	    $(selector).addClass("hidden");
	}
    }


}

//input type="hidden"に使用した関数名を埋め込む
function buryFunc(funcName){
    document.getElementById("funcname").value = funcName;
}
function setIframe(linkTo){
    var iframe = document.createElement('iframe');
    socket.emit("fileAppending","グラフ選択");
    console.log("グラフ選択");
    iframe.setAttribute("src", linkTo);
    iframe.setAttribute("id", "myFrame");
    document.getElementById("chart_div").appendChild(iframe);
    console.log("グラフ表示");
    socket.emit("fileAppending","グラフ表示");
    var container = document.getElementById("container");
    var rect = container.getBoundingClientRect();
    var cStart = $("#up").height();
    sizingIframe(cStart);
}

//都道府県を選択した時に市町村を取得しドロップダウンリストに追加
function citySet(num){

    return new Promise(function(resolve) {
	var baseUrl = "https://opendata.resas-portal.go.jp/";
	var apiKey = "M1o2g9y0ORtM4StEcRPMBxiBwFr6lTPrZa9cXyJh";
	var apiPath = "api/v1/cities?prefCode=";
	var prefCode = document.selbox.pref.selectedIndex;
	console.log("citySet:"+num);
	$.ajax({
	    type: 'GET',
	    url: baseUrl + apiPath + prefCode,
	    headers: { 'X-API-KEY': apiKey},
	    dataType: 'json',
	    success: function(ret){
		console.log(ret.result);
		var parent = document.getElementById("city");
		while (parent.firstChild) parent.removeChild(parent.firstChild);
		
		let op = document.createElement("option");
		op.value = "-";
		op.text = "市町村を選ぶ";
		document.getElementById("city").appendChild(op);
		
		
		for(var i = 0; i < ret.result.length; i++){
		    //console.log(ret.result[i].cityName);
		    let op = document.createElement("option");
		    op.value = ret.result[i].cityCode;
		    op.text = ret.result[i].cityName;
		    document.getElementById("city").appendChild(op);
		}
		$("#city").val(num);
	    }
	    
	});
	
	/*
	if(num){
	    console.log(document.getElementById("city"));
	    console.log(num);
	 
	}
	*/
	resolve(num);
    });
    
    //    var canvas = document.getElementById("myCanvas");
    //var c = canvas.getContext("2d");
    //c.clearRect(0,0,$("#myCanvas").width(),$("#myCanvas").height());
    
}


//RESASの人口構成のページに直接リンクする
//1-1
//scenarioArray[23,23120,1-1]
//[都道府県コード,市町村コード,項目番号]
function linkToPopComp(flag,scenarioArray) {
    //このfunctionも他のlinkTo〜にコピペ
    canvasInitialize();
    if(!flag){
	setCode();
	cityname;
	//var scope;
	if(citycode == "-"){
            scope = 1;//都道府県全体を選択                                                                                              
	}else{
            scope = 2;//市町村を選択                                                                                                    
	}
    }else{
	prefcode = scenarioArray[0];
	citycode = scenarioArray[1];
	if(citycode == "-"){
	    scope = 1;//都道府県全体を選択
	}else{
	    scope = 2;//市町村を選択
	}
	
    }
    
    var linkTo = "https://resas.go.jp/population-composition/#/transition/"+prefcode+"/"+citycode+"/2015/"+scope+"/9.139551352398794/35.07185405/137.44284295";
    console.log(linkTo);
    //window.open(linkTo,'_blank');
//linkToから始まるfunction全部にwindow.open~をコメントアウトして
//以下の部分を他のところにコピペしてください
/////////////////////////////////////////    
    setIframe(linkTo);
    buryFunc("linkToPopComp");
//////////////////////////////////////////

}


//RESASの人口ピラミッドのページに直接リンクする
//ここにコピペ
function linkToPyramid(flag,scenarioArray) {
    
    canvasInitialize();
    if(!flag){
	setCode();
	cityname;
	scope = 0;
	if(citycode == "-"){
            scope = 0;//都道府県全体を選択                                                                                              
	}else{
            scope = 2;//市町村を選択                                                                                                    
	}    
    }else{
	
        prefcode = scenarioArray[0];
	citycode = scenarioArray[1];
	if(citycode == "-"){
	    scope = 0;//都道府県全体を選択
	}else{
	    scope = 2;//市町村を選択
	}
    }
    var linkTo = "https://resas.go.jp/population-composition/#/pyramid/"+prefcode+"/"+citycode+"/2015/"+scope+"/9.139551352398794/35.07185405/137.44284295";
    console.log(linkTo);
    //window.open(linkTo,'_blank');
    setIframe(linkTo);
    buryFunc("linkToPyramid");
}

//RESASの人口増減率のページに直接リンクする
function linkToPopSum(flag,scenarioArray) {
    canvasInitialize();
    if(!flag){
	prefnum = document.selbox.pref.selectedIndex;
	prefcode = document.selbox.pref.options[prefnum].value;
	prefname = document.selbox.pref.options[prefnum].innerText;
	citynum = document.selbox.city.selectedIndex;
	citycode = document.selbox.city.options[citynum].value;
	cityname;
	scope = 0;
	if(citycode == "-"){
            scope = 1;//都道府県全体を選択                                                                                                                          
	}else{
            scope = 2;//市町村を選択                                                                                                                                
	}
    }else{
	
	prefcode = scenarioArray[0];
	citycode = scenarioArray[1];
	if(citycode == "-"){
	    scope = 1;//都道府県全体を選択
	}else{
	    scope = 2;//市町村を選択
	}
    }

    var linkTo = "https://resas.go.jp/population-sum/#/graph/"+prefcode+"/"+citycode+"/2015/"+scope+"/9.139551352398794/35.07185405/137.44284295";
    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToPopSum");
}


//RESASの人口増減率のページに直接リンクする
function linkToPopFur(flag,scenarioArray) {
//グラフは市町村単位でのみ表示
    canvasInitialize();
    var year = 2012;
    if(!flag){
	setCode();
	cityname;
	
	scope = 0;
	if(citycode == "-"){
            scope = 0;//都道府県全体を選択
	}else{
            scope = 0;//市町村を選択
	}
    }else{
        prefcode = scenarioArray[0];
	citycode = scenarioArray[1];
	if(citycode == "-"){
	    scope = 0;//都道府県全体を選択
	}else{
	    scope = 0;//市町村を選択
	}
    }
    var linkTo = "https://resas.go.jp/population-future/#/graph/"+prefcode+"/"+citycode+"/"+year+"/"+scope+"/9.139551352398794/35.07185405/137.44284295";
    setIframe(linkTo);
    buryFunc("linkToPopFur");
}


//RESASの生産分析の移輸出入収支額のグラフに直接リンクする
function linkToRegProd(flag,scenarioArray) {
    canvasInitialize();
    content = 4//表示する内容{1:生産額,2:付加価値額,3:雇用者所得,4:移輸出入収支額}
    category = "-";//表示する分類{-:大分類,01~03:第n次産業} 
    if(!flag){
	setCode();

	year = 2013;
	scope = 0;
	content = 4//表示する内容{1:生産額,2:付加価値額,3:雇用者所得,4:移輸出入収支額}
	category = "-";//表示する分類{-:大分類,01~03:第n次産業}
	if(citycode == "-"){
            scope = 1;//都道府県全体を選択
	}else{
            scope = 2;//市町村を選択
	}
    }else{
	prefcode = scenarioArray[0];
	citycode = scenarioArray[1];
	if(citycode == "-"){
	    scope = 1;//都道府県全体を選択
	}else{
	    scope = 2;//市町村を選択
	}
	
    }

    var linkTo = "https://resas.go.jp/regioncycle-production/#/balance-industry/9.139551352398794/35.07185405/137.44284295/"+prefcode+"/"+citycode+"/"+scope+"/"+year+"/"+content+"/1/"+category+"/-/-";

    setIframe(linkTo);
    buryFunc("linkToRegProd");


}

//RESASの企業海外取引額分析のグラフに直接リンクする
function linkToIndusOverTrans(flag,scenarioArray,item) {

    canvasInitialize();
    setCode();
    var year = 2016;
    var scope = 0;
    //var item = 1;

    var region = 7;


    var linkTo = "https://resas.go.jp/industry-overseas-transaction/#/line/9.139551352398794/35.07185405/137.44284295"+"/"+prefcode+"/"+citycode+"/"+scope+"/"+item+"/1/"+year+"/1/"+region+"/-/-";
    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToIndusOverTrans");
}

//RESASの不動産取引のグラフに直接リンクする
function linkToTownTrans(flag,scenarioArray,type) {

    canvasInitialize();
    setCode();
    var cityname;
    var year = 2013;
    var scope = 0;
    
    if(citycode == "-"){
        scope = 1;//都道府県全体を選択
                                                                                                                                                                                                          
    }else{
        scope = 2;//市町村を選択      
                                                                                                                                                                                                          
    }
    var linkTo = "https://resas.go.jp/town-planning-estate-transaction/#/bar/9.139551352398794/35.07185405/137.44284295/"+prefcode+"/"+citycode+"/"+scope+"/"+year+"/"+type+"/1/00/-/-/-";

    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToTownTrans");
}

//RESASの製造品出荷額等のグラフに直接リンクする
function linkToMuniManu(flag,scenarioArray,category) {

    canvasInitialize();
    setCode();
    var cityname;
    var year = 2015;
    var scope = 0;

    if(citycode == "-"){
        scope = 1;//都道府県全体を選択                                                                                                                                    
    }else{
        scope = 2;//市町村を選択                                                                                                                                          
    }

    var linkTo = "https://resas.go.jp/municipality-manufacture/#/graph/"+prefcode+"/"+citycode+"/"+year+"/E/"+category+"/"+scope+"/9.139551352398794/35.07185405/137.44284295/-";

    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToMuniManu");
}


//RESASの一人あたり賃金に直接リンクする
function linkToMuniWages(flag,scenarioArray) {

    canvasInitialize();
    setCode();
    var cityname;
    var year = 2016;
    var scope = 0;

    if(citycode == "-"){
        scope = 1;//都道府県全体を選択                                                                                                                                   

    }else{
        scope = 2;//市町村を選択                                                                                                                                          
    }
    var age = 1;
    var linkTo = "https://resas.go.jp/municipality-wages/#/graph/"+prefcode+"/"+citycode+"/"+year+"/-/-/"+age+"/0/9.139551352398794/35.07185405/137.44284295/-";

    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToMuniWages");
}

//RESASの一人あたり地方税に直接リンクする                                                                                                                     
function linkToMuniTaxes(flag,scenarioArray) {

    canvasInitialize();
    setCode();
    var cityname;
    var year = 2016;
    var scope = 0;

    if(citycode == "-"){
        scope = 1;//都道府県全体を選択                                                                                                                                   

    }else{
        scope = 2;//市町村を選択                                                                                                                                         
                                                                                                                                                                        
    }
    var linkTo ="https://resas.go.jp/municipality-taxes/#/graph/"+prefcode+"/"+citycode+"/"+year+"/"+scope+"/9.139551352398794/35.07185405/137.44284295/-";
    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToMuniTaxes");

}

//RESASの国籍別訪問者数のグラフに直接リンクする
function linkToTourToVisitor(flag,scenarioArray) {
//都道府県単位でのみ選択
//市町村コードは県内ならどれでも可、URLを見る限り県庁所在地で固定している模様
    canvasInitialize();
    var scope = 0;
    var year = 2017;
    var term = "1";//すべての期間:1, 1-3月期:2, 4-6月期:3, 7-9月期:4, 10-12月期:5
    var region = "-";
    var country = "-";
    var purpose = "1";//すべての目的:1, 観光・レジャー目的:2
    if(!flag){
	setCode();
	cityname;
	if(citycode == "-"){
            scope = 1;//都道府県全体を選択    
	}else{
            scope = 2;//市町村を選択
	}
    }else{
        prefcode = scenarioArray[0];
	citycode = scenarioArray[1];
	if(citycode == "-"){
	    scope = 1;//都道府県全体を選択
	}else{
	    scope = 2;//市町村を選択
	}
	
    }
/*    
      https://resas.go.jp/tourism-foreigners/#/to-visitor/5.333900736553437/41.42090017812787/142.29371418128918/13/13100/100/0/2017/5/-/-/1/-/-
      https://resas.go.jp/tourism-foreigners/#/to-visitor/9.139551352398794/35.07185405/137.44284295/3/03201/1/2011/1/-/-/1
      ttps://resas.go.jp/tourism-foreigners/#/to-visitor/9.139551352398794/35.07185405/137.44284295/100/1/01100/2/2017/1/-/-/1/-/-
*/
    var linkTo = "https://resas.go.jp/tourism-foreigners/#/to-visitor/9.139551352398794/35.07185405/137.44284295/"+prefcode+"/"+citycode+"/100/"+scope+"/"+year+"/"+term+"/"+region+"/"+country+"/"+purpose+"/-/-";
    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToTourToVisitor");
}


//RESASの国籍別訪問者数のグラフに直接リンクする                                                                                                                        
function linkToTourFromVisitor(flag,scenarioArray) {
//都道府県単位でのみ選択                                                                                                                                               
//市町村コードは県内ならどれでも可、URLを見る限り県庁所在地で固定している模様                                                                                          
    canvasInitialize();
    var cityname;
    var scope = 0;
    var year = 2011;
    var term = "1";//すべての期間:1, 1-3月期:2, 4-6月期:3, 7-9月期:4, 10-12月期:5                                                                                      
    var region = "-";
    var country = "-";
    var purpose = "1";//すべての目的:1, 観光・レジャー目的:2                                                                                                           
    if(!flag){
	setCode();
    }else{
	prefcode = scenarioArray[0];
	citycode = scenarioArray[1];
    }


    var linkTo = "https://resas.go.jp/tourism-foreigners/#/from-visitor/9.139551352398794/35.07185405/137.44284295/"+prefcode+"/"+citycode+"/100/"+scope+"/"+year+"/"+term+"/"+region+"/"+country+"/"+purpose+"/-/-";
    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToTourFromVisitor");

}


//RESASの観光資源（目的地）のグラフに直接リンクする                                                                                                                                         //修正の余地あり                              
function linkToTourDest(flag,scenarioArray) {
    canvasInitialize();
    var year = 2017;
    var month = "-";//年度:- 月:1,2,3,...
    var region = "-";
    var country = "-";
    var way = "1";//自動車:1, 公共交通:2
    var date = "1";//平日:1, 休日:2
    var scope = 0;
    if(!flag){
	setCode();	
	if(citycode == "-"){
            scope = 1;//都道府県全体を選択
	    //citycode = document.selbox.city.options[1].value;//一番上は「市町村を選ぶ」のため 
	}else{
            scope = 2;//市町村を選択                                                                                                                                            
	}
	
    }else{
	prefcode = scenarioArray[0];
	citycode = scenarioArray[1];
	if(citycode == "-"){
	    scope = 1;//都道府県全体を選択
	    //citycode = document.selbox.city.options[1].value;//一番上は「市町村を選ぶ」のため
	}else{
	    scope = 2;//市町村を選択
	}

    }
    //scope = 1;
 
// 11/11100/1(スコープ)/0/2015/-(元の散布図の時期)/2(平日休日)/2(交通手段)/2015/-(表示年月)
// 1/01100/2/0/2014/-/1/1/2014/-
    /*
[実際のURL]https://resas.go.jp/tourism-destination/#/toList/9.139551352398794/35.07185405/137.44284295/23/23210/1/0/2017/-/1/1/2017/1/-
https://resas.go.jp/tourism-destination/#/toList/9.139551352398794/35.07185405/137.44284295/23/23100/1/0/2017/-/1/1/2017/-

      https://resas.go.jp/tourism-destination/#/toList/9.139551352398794/35.07185405/137.44284295/3/03201/100/1/2015/-/1/1/2015/-
      https://resas.go.jp/tourism-destination/#/toList/10.00842862207058/35.66837571/139.5558413/13/13100/2/0/2017/3/2/1/2017/3/-


    */
    
    var linkTo = "https://resas.go.jp/tourism-destination/#/toList/9.139551352398794/35.07185405/137.44284295/"+prefcode+"/"+citycode+"/"+scope+"/0/"+year+"/"+month+"/"+date+"/"+way+"/"+year+"/1/"+month;
    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToTourDest");

}


//RESASの延べ宿泊者数のグラフに直接リンクする
function linkToGuestCount(flag,scenarioArray) {

    canvasInitialize();
    var scope = 0;
    if(!flag){
	setCode();
	if(citycode == "-"){
            scope = 1;//都道府県全体を選択                                                                                                                                                                 
	}else{
            scope = 2;//市町村を選択                                                                                                                                                                       
	}
    }else{
        prefcode = scenarioArray[0];
	citycode = scenarioArray[1];
	if(citycode == "-"){
	    scope = 1;//都道府県全体を選択
	}else{
	    scope = 2;//市町村を選択
	}
    }
    //https://resas.go.jp/tourism-hotel-analysis/#/guestCount/6.745954377393461/39.384756315/141.5512993/2/02202/1/1/2/200/2016/0/0/0/0/0/0/0/-
    var linkTo = "https://resas.go.jp/tourism-hotel-analysis/#/guestCount/9.139551352398794/35.07185405/137.44284295/"+prefcode+"/"+citycode+"/"+scope+"/1/2/200/2016/0/0/0/0/0/0/0/-";
    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToGuestCount");


}

//RESASの昼夜間人口のグラフに直接リンクする
function linkToPopCircle(flag,scenarioArray) {


    canvasInitialize();
    var scope = 0;
    var year = 2015;
    if(!flag){
    setCode();

	if(citycode == "-"){
            scope = 1;//都道府県全体を選択
	}else{
            scope = 2;//市町村を選択                                                                                                                                                                                             
	}
    }else{
        prefcode = scenarioArray[0];
	citycode = scenarioArray[1];
        if(citycode == "-"){
	    scope = 1;//都道府県全体を選択
	}else{
	    scope = 2;//市町村を選択
	}
    }
    var linkTo = "https://resas.go.jp/town-planning-commute-school/#/areaPopulationCircle/9.139551352398794/35.07185405/137.44284295/"+prefcode+"/"+citycode+"/"+scope+"/"+year+"/0/0/0/00/00/0/0";
    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToPopCircle");
}


//RESASの企業数のページに直接リンクする
function linkToMuniComp(flag,scenarioArray) {
    canvasInitialize();
    setCode();
    var cityname;

    if(citycode == "-"){
        scope = 3;//都道府県全体を選択                                                                                                                            
    }else{
        scope = 2;//市町村を選択                                                                                                                            
    }
    var largeClass = "-";
    var middleClass = "-";
    var year = 2015;
// https://resas.go.jp/municipality-company/#/graph/23/23210/2014/-/-/2/9.80842795672283/35.07185405/137.44284295
    var linkTo = "https://resas.go.jp/municipality-company/#/graph/"+prefcode+"/"+citycode+"/"+year+"/"+largeClass+"/"+middleClass+"/"+scope+"/9.139551352398794/35.07185405/137.44284295";
    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToMuniComp");

}

//RESASの企業数のページに直接リンクする
function linkToMuniVal(flag,scenarioArray) {
    canvasInitialize();
    var prefnum = document.selbox.pref.selectedIndex;
    var prefcode = document.selbox.pref.options[prefnum].value;
    var prefname = document.selbox.pref.options[prefnum].innerText;
    var citynum = document.selbox.city.selectedIndex;
    var citycode = document.selbox.city.options[citynum].value;
    var cityname;
    var scope;
    if(citycode == "-"){
        scope = 1;//都道府県全体を選択                                                                                                                                                          
    }else{
        scope = 2;//市町村を選択                                                                                                                                                          
    }
    var largeClass = "-";
    var middleClass = "-";
    var year = 2012;

    var linkTo = "https://resas.go.jp/municipality-value/#/graph/"+prefcode+"/"+citycode+"/"+year+"/"+largeClass+"/"+middleClass+"/"+scope+"/9.139551352398794/35.07185405/137.44284295";
    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToMuniVal");

}

function linkToMuniProd(flag,scenarioArray) {

    canvasInitialize();
    var prefnum = document.selbox.pref.selectedIndex;
    var prefcode = document.selbox.pref.options[prefnum].value;
    var prefname = document.selbox.pref.options[prefnum].innerText;
    var citynum = document.selbox.city.selectedIndex;
    var citycode = document.selbox.city.options[citynum].value;
    var cityname;
    var scope;
    if(citycode == "-"){
        scope = 1;//都道府県全体を選択
    }else{
        scope = 2;//市町村を選択
    }
    var largeClass = "-";
    var middleClass = "-";
    var year = 2012;
    
    var linkTo = "https://resas.go.jp/municipality-labor/#/graph/"+prefcode+"/"+citycode+"/"+year+"/"+largeClass+"/"+middleClass+"/"+scope+"/9.139551352398794/35.07185405/137.44284295";
    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToLabProd");


}

//農業部門別販売金額を表示
function drawAgriChart(flag,scenarioArray) {

    //canvas,wrapperを初期化
    canvasInitialize();

    var deferred = new $.Deferred();
    var apiPath = "api/v1/agriculture/all/forStacked";

    var prefnum = document.selbox.pref.selectedIndex;
    var prefcode = document.selbox.pref.options[prefnum].value;
    var prefname = document.selbox.pref.options[prefnum].innerText;
    var citynum = document.selbox.city.selectedIndex;
    var citycode = document.selbox.city.options[citynum].value;
    var cityname;
    console.log(citycode);
    if(citycode == "-"){ 
	cityname = "全体";
    }else{
	cityname = document.selbox.city.options[citynum].innerText;    	    
    }
    var data = new google.visualization.DataTable();
    data.addColumn('string', '種類');
    data.addColumn('number', '販売金額（百万円）');
    
    $.ajax({
	type: 'GET',
	url: baseUrl + apiPath,
	headers: { 'X-API-KEY': apiKey },
	data: {cityCode: citycode, prefCode: prefcode, year: 2010},
	dataType: 'json',
	success: function(ret){
	    console.log(ret);
	    for (var i = 0; i < ret.result.data.length; i++) {
		var label = ret.result.data[i].sectionName;
		var val = ret.result.data[i].value;
		data.addRow([label, val]);
            }

	    var options = {
		title: '農産物ごとの売上金額（'+prefname+cityname+'）',
		isStacked: false, // trueにすると積み上げ棒グラフになる
		animation: {
		    duration: 2000,
		    easing: 'out',
		    startup: true,
                
		},
                height: 600 
	    };
	    
	    var chart = new google.visualization.BarChart(document.getElementById('chart_div'));//chart_div
	    chart.draw(data, options);
//	    console.log($("div").find("aria-hidden").prevObject[17].removeAttr("aria-hidden"));
//	    console.log($("div + aria-hidden").find().removeAttr("aria-hidden"));
//	    console.log($('#chart_div').first().children().find("aria-hidden"));	    
//	    $('div').removeAttr('aria-hidden');
//	    $('div').removeAttr('display');

	    buryFunc("drawAgriChart");
	    deferred.resolve();
        }
    });

}

//経営耕地面積
function linkToAgriLand(flag,scenarioArray) {


    canvasInitialize();
    var prefnum = document.selbox.pref.selectedIndex;
    var prefcode = document.selbox.pref.options[prefnum].value;
    var prefname = document.selbox.pref.options[prefnum].innerText;
    var citynum = document.selbox.city.selectedIndex;
    var citycode = document.selbox.city.options[citynum].value;
    var cityname;
    var scope;
    if(citycode == "-"){
        scope = 1;//都道府県全体を選択                                                                                                                                                                          
    }else{
        scope = 2;//市町村を選択                                                                                                                                                                                
    }
    var largeClass = "-";
    var middleClass = "-";
    var year = 2015;

    /*
    https://resas.go.jp/agriculture-land/#/area/9.80842795672283/35.07185405/137.44284295/3/03203/1/2015/1/1/-/-
    https://resas.go.jp/agriculture-land/#/map/9.892795765722731/39.0819011/141.7085467/3/03203/2/2015/1/1/-/-
    */
    var linkTo = "https://resas.go.jp/agriculture-land/#/area/9.80842795672283/35.07185405/137.44284295/"+prefcode+"/"+citycode+"/"+scope+"/"+year+"/1/1/-/-";
    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToAgriLand");


}

function linkToAgriSales(flag,scenarioArray) {


    canvasInitialize();
    var prefnum = document.selbox.pref.selectedIndex;
    var prefcode = document.selbox.pref.options[prefnum].value;
    var prefname = document.selbox.pref.options[prefnum].innerText;
    var citynum = document.selbox.city.selectedIndex;
    var citycode = document.selbox.city.options[citynum].value;
    var cityname;
    var scope;
    if(citycode == "-"){
        scope = 1;//都道府県全体を選択                                                                                                                                                                
    }else{
        scope = 2;//市町村を選択                                                                                                                                                                
    }
    var largeClass = "-";
    var middleClass = "-";
    var year = 2015;

    var linkTo = "https://resas.go.jp/agriculture-sales/#/graph/9.80842795672283/35.07185405/137.44284295/"+prefcode+"/"+citycode+"/"+scope+"/"+year+"/1/-/-/-/-";
    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToAgriSales");
//https://resas.go.jp/agriculture-sales/#/graph/9.670066069097572/35.07185405/137.44284295/23/23210/2(表示レベルを指定する)/2010(表示年を指定する)/2(表示する内容を指定する)/-(農業部門を指定する)/-(表示する内容を指定する)
}


function linkToForestIncome(flag,scenarioArray) {

    canvasInitialize();
    var prefnum = document.selbox.pref.selectedIndex;
    var prefcode = document.selbox.pref.options[prefnum].value;
    var prefname = document.selbox.pref.options[prefnum].innerText;
    var citynum = document.selbox.city.selectedIndex;
    var citycode = document.selbox.city.options[citynum].value;
    var cityname;
    var scope;
    if(citycode == "-"){
	scope = 1;//都道府県全体を選択                                                                                                                                                                
    }else{
        scope = 2;//市町村を選択                                                                                                                                                                
    }
    var largeClass = "-";
    var middleClass = "-";
    var year = 2015;

    var linkTo = "https://resas.go.jp/forestry-income/#/graph/9.80842795672283/35.07185405/137.44284295/"+prefcode+"/"+citycode+"/"+scope+"/"+year+"/1/1/-/-";
    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToForestIncome");



}


function linkToForestLand(flag,scenarioArray) {

    canvasInitialize();
    var prefnum = document.selbox.pref.selectedIndex;
    var prefcode = document.selbox.pref.options[prefnum].value;
    var prefname = document.selbox.pref.options[prefnum].innerText;
    var citynum = document.selbox.city.selectedIndex;
    var citycode = document.selbox.city.options[citynum].value;
    var cityname;
    var scope;
    if(citycode == "-"){
        scope = 1;//都道府県全体を選択                                                                                                                                                                       
    }else{
        scope = 2;//市町村を選択                                                                                                                                                                             
    }

    var year = 2015;

    var linkTo = "https://resas.go.jp/forestry-land/#/area/9.80842795672283/35.07185405/137.44284295/"+prefcode+"/"+citycode+"/"+scope+"/"+year+"/1/1/-/-/-";
    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToForestLand");

}




function linkToFishery(flag,scenarioArray,category) {

    canvasInitialize();
    var prefnum = document.selbox.pref.selectedIndex;
    var prefcode = document.selbox.pref.options[prefnum].value;
    var prefname = document.selbox.pref.options[prefnum].innerText;
    var citynum = document.selbox.city.selectedIndex;
    var citycode = document.selbox.city.options[citynum].value;
    var cityname;
    var scope;
    if(citycode == "-"){
        scope = 1;//都道府県全体を選択
	
    }else{
        scope = 2;//市町村を選択                                                                                                                                         

    }

    var year = 2013;

    var linkTo = "https://resas.go.jp/fishery-sea/#/graph/9.80842795672283/35.07185405/137.44284295/"+prefcode+"/"+citycode+"/"+scope+"/"+year+"/1/"+category+"/-/-/-";

    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToFishery");

}


function linkToIndusTrans(flag,scenarioArray,content) {


    canvasInitialize();
    var prefnum = document.selbox.pref.selectedIndex;
    var prefcode = document.selbox.pref.options[prefnum].value;
    var prefname = document.selbox.pref.options[prefnum].innerText;
    var citynum = document.selbox.city.selectedIndex;
    var citycode = document.selbox.city.options[citynum].value;
    var cityname;
    var scope;
    if(citycode == "-"){
        scope = 1;//都道府県全体を選択
    }else{
        scope = 2;//市町村を選択      
    }

    var year = 2013;


    var linkTo = "https://resas.go.jp/industry-statistics-all/#/transition/"+prefcode+"/"+citycode+"/"+scope+"/"+content+"/1/"+year+"/E/-/-";

    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToIndusTrans");
}


function linkToMuniSales(flag,scenarioArray,industry,content) {


    /*
      industryが１のとき卸売業、２のとき小売業
     */
    canvasInitialize();
    var prefnum = document.selbox.pref.selectedIndex;
    var prefcode = document.selbox.pref.options[prefnum].value;
    var prefname = document.selbox.pref.options[prefnum].innerText;
    var citynum = document.selbox.city.selectedIndex;
    var citycode = document.selbox.city.options[citynum].value;
    var cityname;
    var scope;
    if(citycode == "-"){
        scope = 1;//都道府県全体を選択                                                                                                                                   
    }else{
        scope = 2;//市町村を選択                                                                                                                                         
    }

    var year = 2014;
    
    var linkTo = "https://resas.go.jp/municipality-sales/#/graph/"+prefcode+"/"+citycode+"/"+scope+"/"+year+"/"+industry+"/"+content+"/1/9.80842795672283/35.07185405/137.44284295/-";
    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToMuniSales");

}

function linkToConsComm(flag,scenarioArray,industry) {

    canvasInitialize();
    var prefnum = document.selbox.pref.selectedIndex;
    var prefcode = document.selbox.pref.options[prefnum].value;
    var prefname = document.selbox.pref.options[prefnum].innerText;
    var citynum = document.selbox.city.selectedIndex;
    var citycode = document.selbox.city.options[citynum].value;
    var cityname;
    var scope;
    if(citycode == "-"){
        scope = 1;//都道府県全体を選択                                                                                                                                                                         
    }else{
        scope = 2;//市町村を選択                                                                                                                                                                               
    }
    scope = 1;//市町村を選択するとデータが表示されない @2018/7/25
    var year = 2014;
    
    var linkTo = "https://resas.go.jp/consumption-commerce-all/#/transition/"+prefcode+"/"+citycode+"/"+scope+"/1/1/1/"+year+"/"+industry+"/-/-";

    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToConsComm");
}

function linkToFisheryBoat(flag,scenarioArray) {

    canvasInitialize();
    var prefnum = document.selbox.pref.selectedIndex;
    var prefcode = document.selbox.pref.options[prefnum].value;
    var prefname = document.selbox.pref.options[prefnum].innerText;
    var citynum = document.selbox.city.selectedIndex;
    var citycode = document.selbox.city.options[citynum].value;
    var cityname;
    var scope;
    if(citycode == "-"){
        scope = 1;//都道府県全体を選択                                                                                                                                                                 

    }else{
        scope = 2;//市町村を選択                                                                                                                                                                       

    }

    var year = 2013;
    var linkTo = "https://resas.go.jp/fishery-sea-boat/#/graph/9.80842795672283/35.07185405/137.44284295/"+prefcode+"/"+citycode+"/"+scope+"/"+year+"/1/1/-/-/-/-";

    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToFisheryBoat");

}

function linkToAgriAge(flag,scenarioArray) {
    canvasInitialize();
    var prefnum = document.selbox.pref.selectedIndex;
    var prefcode = document.selbox.pref.options[prefnum].value;
    var prefname = document.selbox.pref.options[prefnum].innerText;
    var citynum = document.selbox.city.selectedIndex;
    var citycode = document.selbox.city.options[citynum].value;
    var cityname;
    var scope;
    if(citycode == "-"){
        scope = 1;//都道府県全体を選択
    }else{
        scope = 2;//市町村を選択      
    }

    var year = 2013;

    var linkTo = "https://resas.go.jp/agriculture-crops/#/composition/9.80842795672283/35.07185405/137.44284295/"+prefcode+"/"+citycode+"/1/"+scope+"/"+year+"/1/-/-/-/-"
    console.log(linkTo);
    setIframe(linkTo);
    buryFunc("linkToAgriAge");

}


function drawManuChart(flag,scenarioArray) {

    var deferred = new $.Deferred();
    var apiPath = "api/v1/municipality/manufacture/perYear";

    var data = new google.visualization.DataTable();
    data.addColumn('string', '種類');
    data.addColumn('number', '販売金額（百万円）');

    $.ajax({
	type: 'GET',
	url: baseUrl + apiPath,
	headers: { 'X-API-KEY': apiKey },
	data: {cityCode: cityCode, prefCode: prefCode, year: 2010},
	dataType: 'json',
	success: function(ret){
	    for (var i = 0; i < ret.result.data.length; i++) {
		var label = ret.result.data[i].sectionName;
		var val = ret.result.data[i].value;
		data.addRow([label, val]);
            }

	    var options = {
		title: '農産物ごとの売上金額（）',
		isStacked: false, // trueにすると積み上げ棒グラフになる
		animation: {
		    duration: 2000,
		    easing: 'out',
		    startup: true,
                
		},
                height: 600 
	    };
	    
	    var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
	    chart.draw(data, options);
	    deferred.resolve();
        }
    });
}

function geo2CityCode(lat, lng) {
    var deferred = new $.Deferred();
    $.ajax({
	type: 'GET',
	url: "https://www.cotogoto.ai/hikyoekirank/city",
	data: {lat: lat, lng: lng},
	dataType: 'json',
	success: function(ret){
	    $('#locinfo').attr("cityCode", ret.cityCode);
	    $('#locinfo').attr("prefCode", ret.prefCode);
	    deferred.resolve();
	}
    });    
    return deferred.promise();
}
