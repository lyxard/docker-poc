//===========================================================================
// function dateVal
//===========================================================================
function dateVal(from_obj, to_obj) {
    // Perform date validation
    var from = from_obj.value;
    var to = to_obj.value;
    var msg = "";
        
    if ( to != undefined ) {
         var to_split = to.split("/");
         var from_split = from.split("/");

         if ( to_split.length == 3 && from_split.length == 3 ) {
	      var to_comp = to_split[2] + to_split[0] + to_split[1];
	      var from_comp = from_split[2] + from_split[0] + from_split[1];
         }
	 if ( from_comp > to_comp ) {
	      msg += "The From Date is greater than the To Date.";
	 }
    }
    if ( msg != "" ) {
	alert(msg);
	return false;
    }
    return true;
}

//===========================================================================
// function fixDateFormat
// changes date format from m/d/yr to mm/dd/yr
//===========================================================================
function fixDateFormat(obj){
	var datePat;
	var dateStr=document[obj].value;
	var matchArray;

        if (dateStr.indexOf("/")==-1) {
                datePat=/^(\d{1,2})(\d{2})(\d{2}|\d{4})?$/;
                matchArray=dateStr.match(datePat);
                mth=matchArray[1];
                day=matchArray[2];
                yr=matchArray[3];
                mth=mth+"";
                day=day+"";
                yr=yr+"";

                dateStr=((mth.length==2)?mth:"0"+mth)+"/"+((day.length==2)?day:"0"+day)+((yr=="")?"":("/"+yr))
        }
        datePat=/^(\d{1,2})\/(\d{1,2})(\/(\d{2}|\d{4}))?$/;
        matchArray=dateStr.match(datePat);
        mth=matchArray[1];
        day=matchArray[2];
        yr=matchArray[4];
        document[obj].value=((mth.length==2)?mth:"0"+mth)+"/"+((day.length==2)?day:"0"+day)+((yr=="")?"":("/"+yr));
 }
//===========================================================================
// function ValDate
// Takes in the form name and the field name.
// Also can just take in a field name.
//===========================================================================
function ValDate(form_name,field_name) {
	var datePat;
	var matchArray;
	var maxDay;
	var mth;
	var day;
	var yr;
	var tmpDate=new Date();
	var dateStr;
	if(field_name == ""){
		dateStr=document[form_name].value;
	} else {
		dateStr=document[form_name][field_name].value;
	}
	var errmsg="";
	if (dateStr.length==0) return "";
	dateStr=dateStr.replace(/\s|\.|-|,/gi,"/");
	var valInArray = dateStr.split("/");
	var monthnum = 0;

	if (dateStr.indexOf("/")==-1) {
	    datePat=/^(\d{1,2})(\d{2})(\d{2}|\d{4})?$/;
	    matchArray=dateStr.match(datePat);
	    if (matchArray==null) errmsg="Invalid date format.";
	    mth=matchArray[1];
	    day=matchArray[2];
	    yr=matchArray[3];
	    mth=mth+"";
	    day=day+"";
	    yr=yr+"";
	    dateStr=((mth.length==2)?mth:"0"+mth)+"/"+((day.length==2)?day:"0"+day)+((yr=="")?"":("/"+yr));
	}
	datePat=/^(\d{1,2})\/(\d{1,2})(\/(\d{2}|\d{4}))?$/;
	matchArray=dateStr.match(datePat);
	if (matchArray==null){ errmsg="Invalid date format.";
	}else{
	    mth=matchArray[1];
	    day=matchArray[2];
	    yr=matchArray[4];
	
	    if(mth==0 || day==0) errmsg="Invalid date format.";
	    if (yr=="")	yr=tmpDate.getFullYear();
	    else{
		if (yr.length==2 || yr.length==3) yr=parseInt(yr,10)+2000;
	    }
	    if (mth>12) errmsg="Month must be between 1 and 12.";
	    if (mth==2) {
		// check for leap year
		if (((yr%4==0)&&(yr%100!=0))||(yr%400==0)) maxDay=29;
		else maxDay=28;
	    }
	    else if(mth>7){
		if(mth%2==0) maxDay=31;
			 else maxDay=30;
	    }
	    else {
		if(mth%2!=0) maxDay=31;
		else maxDay=30;
	    }
	    if (day>maxDay) errmsg = "Day must be between 1 and "+maxDay+".";
	    mth=mth+"";
	    day=day+"";

	    if(field_name == ""){
		document[form_name].value=((mth.length==2)?mth:"0"+mth)+"/"+((day.length==2)?day:"0"+day)+"/"+yr;
	    } else {
        
		document[form_name][field_name].value=((mth.length==2)?mth:"0"+mth)+"/"+((day.length==2)?day:"0"+day)+"/"+yr;
	    }
	}
	if (errmsg!="")
		alert(errmsg);
	return true;
}
