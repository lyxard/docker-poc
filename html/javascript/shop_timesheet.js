// name:     $RCSfile: eng_timesheet3.js,v $
// process:  Static timesheet javascript functions
// authors:  Simon Taylor and Becky Alcorn - Unisolve Pty Ltd
// revision: $Id: eng_timesheet3.js,v 1.2 2003/07/23 00:13:25 staylor Exp $

    var tot_std = new Array();
    var tot_ot = new Array;
    var sockets_active = false;

    // Validates the current row
    // Called by:
    // change_line
    // validateline
    //
    function validate_row()
    {
        var message = "";
        var errorCount = 0;
	  var jobNum = document.main.jobNumber.value;

            if (jobNum == "")
            {
                message += "A Job No. is required for each time entry.\n";
		document.main.jobNumber.focus();
		document.main.jobNumber.select();
                errorCount += 1;
            } else if (isNaN(jobNum))
            {
                message += "The Job No. must be a numeric value.\n";
		document.main.jobNumber.focus();
		document.main.jobNumber.select();
                errorCount += 1;
            } else if ((!(jobNum >= 2 && jobNum < 100 )) &&
		       (!(jobNum >= 130 && jobNum < 140)) &&
		       (!(jobNum > 171 && jobNum < 196)) &&
		       (!(jobNum > 1000)))
            {
                message += "The Job No. must be in the ranges 2 to 99, 130 to 139, 171 to 196, or greater than 1000.\n";
		document.main.jobNumber.focus();
		document.main.jobNumber.select();
            }
/*
	if(validatedate()==0){
	    message += "Invalid date.\n";
	}
*/

/*        if (document.main.mark.value == "")
        {
            message += "A mark is required for each time entry.\n";
	    document.main.mark.focus();
	    document.main.mark.select();
            errorCount += 1;
        }*/

        if (document.main.activity.value == "")
        {
            message += "An activity number is required for each time entry.\n";
	    document.main.activity.focus();
	    document.main.activity.select();
            errorCount += 1;
        }

	//
	// Use following if memo must not be blank
	//

        var temp=(document.main.memo.value).match(/.*/);
        document.main.memo.value=temp;

	if (message == "")
        {
            return true;
        } else
        {
            alert("Please correct the following:\n" + message);
        }
        return false;
    }


    /////////////////////////////////////////////////////////////////////////
    //DATE
    /////////////////////////////////////////////////////////////////////////

    //
    // Blocks all key strokes in date field
    // +/=/-/_ increment/decrement date
    // Called by: 
    // keypress event on date field
    //
    function block_plus_and_minus_date(e)
    {
        var keyChar = String.fromCharCode(e.which);
		
        if (keyChar == '+' || keyChar == '=')
        {
            change_date(theDate, 1);
            return false;
        } else if (keyChar == '-' || keyChar == '_')
        {
            change_date(theDate, -1);
            return false;
        } else
        {
            return true;
        }
    }
    //
    // Validates dates entered manually
    // Allows: 	mm/dd/yyyy
    //		mm/dd/yy
    //		mm/dd
    // Called by:
    // onchange event on date field
    //
    function validatedate()
    {
	var mdy = false;
	var a = document.main.textdate.value.split("/");
	if (a.length == 3)
	{
	    mdy = true;
	} else if (a.length != 2)
	{
	    dateError = true;
	}
	if (dateError == false)
	{
	    // Check it is mm/dd/yyyy
	    if (a[0].length > 2 || a[0].length < 1)
	    {
		dateError = true;
	    } else if (isNaN(a[0]) || isNaN(a[1]))
	    {
		dateError = true;
	    } else if (a[0] > 12 || a[0] < 1)
	    {
		dateError = true;
	    } else if (a[1] > 31 || a[1] < 1)
	    {
		dateError = true;
	    }
	    if (mdy == true)
	    {
		if (isNaN(a[2]))
		{
		    dateError = true;
		} else if (a[2].length !=2 && a[2].length != 4)
		{
		    dateError = true;
		} else if ( (!(a[2] < 2100 && a[2] > 1999)) && (!(a[2] < 100 && a[2] >= 0)) )
		{
		    dateError = true;
		}
	    }
	}

	if (dateError == true)
	{
	    alert("Date must be in this format: mm/dd/yyyy.");
            //setTimeout('document.main.textdate.focus()',10);
	    document.main.textdate.select();
	    dateError = false;
	    return 0;
	} else
	{
	    makeDate(a);
	    return 1;
	}
    }

    //
    // Converts an array (month, day, [year]) to a date
    // Used in conjunction with validatedate() (see above)
    // Called by:
    // validatedate
    //
    function makeDate(a)
    {
	    var someDate = new Date();

            // order of the following 2 statements matters
            // EX: if today's date is 04/01/2004 (April Fool's Day) 
            // & textdate is currently 03/31/2004 the call to setDate
            // will fail since April only has 30 days  
	    someDate.setMonth(a[0] - 1);
	    someDate.setDate(a[1]);

	    if (a.length == 3)
	    {
		if (a[2].length == 2)
		{
		    a[2] = "20" + a[2];
		}
		someDate.setFullYear(a[2]);
	    }
	    theDate = someDate;
	    modify_date();
    }

    //
    // Displays todays date and day in the text fields
    // Called by:
    // reset_row
    // load_row
    // makeDate
    // change_date
    //
    function modify_date()
    {
	document.main.textdate.value = representDate(theDate);
        arr_assert("modify_date 1", (theDate.getDay()));
	document.main.textday.value = weekdays[theDate.getDay()];
    }

    //
    // Displays the date passed in, in the format mm/dd/yyyy
    // Called by:
    // modify_date
    //
    function representDate(aDate)
    {
	var message = '';
	var aDay = aDate.getDate();
	var aMonth = aDate.getMonth() + 1;
	var aYear = aDate.getFullYear();
		
        if (aMonth < 10)
	{
	    message += '0' + aMonth;
	}
	else
	{
	    message += aMonth;
	}
	message += '/';
	if (aDay < 10)
	{
	    message += '0' + aDay;
	}
	else
	{
	    message += aDay;
	}
		
	message += '/' + aYear;
	return message;
    }

    //
    // Changes the date by the number of days passed in
    // Called by:
    // onclick date +/- image map
    // block_plus_and_minus_date
    //
    function change_date(oldDate, days)
    {
	var anotherDate = new Date(oldDate.getTime() + days*24*60*60*1000);
	theDate = anotherDate;
	modify_date();
    }


    function block_enter(e){
	if(e.keyCode==0 || e.keyCode==9){
	    return true;
	}
	return false;
    }
    //
    // Blocks "~" for the entire document due to its special treatment in
    // hidden fields.
    // Called by:
    // keypress event on activity and memo fields
    //
    function block_tilda(e)
    {
        var keyChar = String.fromCharCode(e.which);
        if (keyChar == '~')
        {
            return false;
        }
	else if(keyChar == '\"'){
	    return false;
	}
	else
        {
            return true;
        }
    }

    /////////////////////////////////////////////////////////////////////////
    //ACTIVITY
    /////////////////////////////////////////////////////////////////////////

    //
    // We allow for three types of activities:
    // 1. Manually entered by the user
    //
    // 2. Special activities selected from the pull down list, these are:
    //    
    //        JURY DUTY
    //        PERSONAL
    //        REIMBURSE
    //        SICK
    //        VACATION
    //	      HOLIDAY
    //        BEREAVEMENT
    //    
    //    For these, activities, we use the employee's department as the
    //    job number.
    //
    // 3. Any other activity selected from the pull down list

    // If manually typed activity is in list, change selected option to that,
    // otherwise selected option is "activity"
    //

    // Called by:
    // onchange event on the activity field
    // saveData
    // load_row
    function validate_act(changed)
    {
        set_update_time();
	if (changed == "true")
	{
            //changeMade = 1;
	}
        var found = false;
        if (document.main.activity.value == '')
        {
            alert("The Cost Code cannot be blank.");
            actError = true;
        } else
	{
	    actError = false;
	}
	// Force the activity to be uppercase
	document.main.activity.value = document.main.activity.value.toUpperCase();
        // Append .00 to a numeric Cost Code unless job is 100.01
	if (document.main.jobNumber.value != '2006') {
            var expr1 = /\d/;
            var expr2 = /\./;

            if ( (expr1.test(document.main.activity.value)) && (!expr2.test(document.main.activity.value)) ) {
                  document.main.activity.value = document.main.activity.value; // + ".00";
		updateMade();
            } 
            if (document.main.activity.value.charAt(document.main.activity.value.length - 1) == "\." ) {
                document.main.activity.value = document.main.activity.value; // + "00";
		updateMade();
            }
            if ( (document.main.activity.value.charAt(document.main.activity.value.length - 2) == "\.") && (document.main.activity.value.charAt(document.main.activity.value.length - 1) == "0") ) {
                  document.main.activity.value = document.main.activity.value; // + "0";
		updateMade();
            }
	} else {
//	    validate_c2_service_job();
            document.main.select_act.options[0].selected = true; 
	    return;
	}

        var act_value = document.main.activity.value;
	for (var i = 0; i < document.main.select_act.length; i++)
        {
            //Update select box
            sel_assert("validate_act 1", (i));
	    if (act_value == document.main.select_act.options[i].value) 
            {
                document.main.select_act.options[i].selected = true;
                // Load up the activity description field
                found = true;
                if (document.main.select_act.options[i].value == "Cost Code")
                {
                    typeAct = 0;
		    specialAct = false;
		    reimburseAct = false;
                } else
                {
                    typeAct = 1;
		    specialAct = false;
		    reimburseAct = false;
                }
            }
        }
        if (!found)
        {
            document.main.select_act.options[0].selected = true; 
            typeAct = 0;
	    specialAct = false;
	    reimburseAct = false;
	    alert("The Cost Code must be found in the dropdown list.");
	    document.getElementById("clockIn").disabled = true;
	    badRecord = true;
            //setTimeout('document.main.activity.focus()',10);
        }
	else
	{
           document.getElementById("clockIn").disabled = false;
	}
    }

    /////////////////////////////////////////////////////////////////////////
    // ACTIVITY DESCRIPTION
    /////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////
    //LINE
    /////////////////////////////////////////////////////////////////////////

    function validateLine(){
        set_update_time();
	var currNo = document.main.No.value;
	if(notValidated || 
		 document.main.jobNumber.value != "" || 
		 document.main.activity.value  != "" || 
		 document.main.memo.value      != "") {
	    if(!validate_row()){
		return false;
	    }
	}
	if(isNaN(currNo)){
	    alert("The Line number must be a number.");
	    if(currRow ==0)
	 	document.main.No.value = currRow+1;
	    else
		document.main.No.value = currRow;
	    return false;
	}
	else if(currNo < 1)
	{
	    alert("The Line number must be a positive number.");
            if(currRow ==0)
                document.main.No.value = currRow+1;
            else
                document.main.No.value = currRow;
	    return false;
	}
	else if((currNo.search(/\./)) != -1 )
        {
            alert("The Line number can not be a decimal.");
	    return false;
	} else
        {
	    if(document.main.No.value > lastRecord()){
	      if (last_row_clocked_in() == true) {
	        newRecord();
	      } else {
		selectRecord(lastRecord());
	      }
	    }
	    else{
		selectRecord(document.main.No.value);
	    }
	    //return false;
	    return true;
        }
    }

    function last_row_clocked_in() {
      var last_row = lastRecord() -1;
      tablebody = document.getElementById("dataTable");
      if (tablebody.childNodes[last_row].childNodes[4].firstChild.nodeValue == '') {
        return false;
      }
      return true;
    }

    //
    // Captures +/=/-/_ key events for the line number field
    // for increment/decrement
    // Called by:
    // keypress event on line number field
    //
    function block_plus_and_minus_line(e)
    {
        set_update_time();
        var keyChar = String.fromCharCode(e.which);
	var currNo = document.main.No.value;
	if(notValidated || 
		 document.main.jobNumber.value!="" || document.main.activity.value!="" ||
		 document.main.memo.value != ""){
	    if(!validate_row()){
		return false;
	    }
	}
	if( keyChar != '0' && keyChar != '1' && keyChar != '2' && keyChar != '3' &&
		keyChar != '4' && keyChar != '5' && keyChar != '6' && 
		keyChar != '7' && keyChar != '8' && keyChar != '9' &&
		keyChar != '+' && keyChar != '=' && keyChar != '-' &&
		keyChar != '_' && e.keyCode != 8 && e.keyCode != 9 && e.keyCode != 46) {
	    return false;
	
	}
        if (keyChar == '+' || keyChar == '=')
        {
		if(noRecords){
		    alert("You have no records.");
		    return false;
		}
            if (sockets_active == false) {
                sockets_active = true;
                change_line(currNo, 1);
                sockets_active = false;
            }
            return false;
        } else if (keyChar == '-' || keyChar == '_')
        {
		if(noRecords){
		    alert("You have no records.");
		    return false;
		}
            if (sockets_active == false) {
                sockets_active = true;
                change_line(currNo, -1);
                sockets_active = false;
            }
            return false;
        } else
        {
	    return true;
        }
    }


    //
    // Validates and changes line number if +/- keys are used
    // Called by:
    // +/- buttons onclick
    // saveData
    // block_plus_and_minus_line
    //
    function change_line(oldLine, lines)
    {
        set_update_time();
	//var tempBody = document.getElementsByTagName("tbody").item(3);
	var tempBody = document.getElementById("dataTable");
	var lastLine = tempBody.lastChild.firstChild.firstChild.nodeValue;

        if ((oldLine == "1" && lines < 0) || (oldLine == 1 && lines < 0))
        {
            alert("Cannot go below Line number 1.");
            document.main.No.focus();
        } else
        {
            changeMade = 1;
            if (document.main.jobNumber.value == "" &&
                document.main.activity.value == "") 
            {
                if ((lines - 0) < 0)
                {
                    theLine = (oldLine - 0) + lines;
                    document.main.No.value = theLine;
		    selectRecord(theLine);
                }
            } else
            {
		theLine = (oldLine-0) + lines;
		if(theLine <= lastLine){
		    selectRecord(theLine);
		}
		else if(theLine > lastLine){
		    newRecord();
		}
            }
        }
    }

    /////////////////////////////////////////////////////////////////////////
    //HOURS
    /////////////////////////////////////////////////////////////////////////

    //
    // Captures +/=/-/_ key events for the hours field
    // for increment/decrement
    // Called by:
    // keypress event on hour field
    //
    function block_plus_and_minus_hour(e)
    {
        set_update_time();
        var keyChar = String.fromCharCode(e.which);
        if(keyChar == '+' || keyChar == '=')
        {
            change_hour(.25);
            return false;
        } else if (keyChar == '-' || keyChar == '_')
        {
            change_hour(-.25);
            return false;
        } else
        {
            return true;
        }
    }

    /////////////////////////////////////////////////////////////////////////
    //OVERTIME
    /////////////////////////////////////////////////////////////////////////

    //
    //Toggles hours and minutes between standard and over time
    // Called by:
    // onclick event on overtime checkbox
    //
    function toggle_std_ot()
    {
        set_update_time();
        changeMade = 1;
        arr_assert("tog_std_ot 2", (theLine - 1));
        document.main.dtcheck.checked = false;
    }
    /////////////////////////////////////////////////////////////////////////
    //DOUBLETIME
    /////////////////////////////////////////////////////////////////////////

    //
    //Toggles hours and minutes between standard and double time
    // Called by:
    // onclick event on overtime checkbox
    //
    function toggle_std_dt()
    {
        set_update_time();
        changeMade = 1;
        arr_assert("tog_std_dt 2", (theLine - 1));
        document.main.otcheck.checked = false;
    }

    /////////////////////////////////////////////////////////////////////////
    //ASSERT
    /////////////////////////////////////////////////////////////////////////

    //
    // Provide runtime assert checking for other arrays
    // Called by:
    // init_row
    // reset_row
    // modify_date
    // toggle_std_ot
    //
    function arr_assert(place, expression)
    {
        // Ensure that the supplied value would not access invalid parts of
        // the array (30 is an arbitrary upper limit, change it as 
        // circumstances dictate).
        if ((expression < 0) || (expression > (100)))
        {
            alert(place + ": Assert warning. Bad value in array: " +
                  expression + "\nPlease contact support.");
        }
    }

    //
    // Provide runtime assert checking for select arrays (allow 6 as max index)
    // Called by:
    // validate_job_no
    // act_select
    // validate_act
    // job_select
    //
    function sel_assert(place, expression)
    {
        // Ensure that the supplied value would not access invalid parts of
        // the select options array. (30 is an arbitrary upper limit, change
        // it as circumstances dictate).

        if ((expression < 0) || (expression > (document.forms[1].select_act.options.length)))
        {
            alert(place + ": Assert warning. Bad value in select option: " + 
                  expression + "\nPlease contact support.");
        }
    }

    /////////////////////////////////////////////////////////////////////////
    //HELP
    /////////////////////////////////////////////////////////////////////////

    //
    // Opens help window and displays help file
    // Called by:
    // onclick event of the Help button
    //
    function accoWin()
    {
        var mywin=open("/acco_help.html", "displayWindow", "width=580,height=380,status=no,toolbar=no,scrollbars=yes,menubar=no");
    }

    /////////////////////////////////////////////////////////////////////////
    //JOB SELECTION
    /////////////////////////////////////////////////////////////////////////

    //
    // Display hidden field value if it's not null and Job Number is selected
    // otherwise display selected value
    // Called by:
    // onchange event of the job select list
    //
    function job_select()
    {
        set_update_time();
	if (specialAct == true)
	{
	    //Don't change it.
	    document.main.select_job.options[0].selected = true;
	    return;
	}
        var selected = document.main.select_job.selectedIndex;
        sel_assert("job_select 1", (selected));
        var select_value = document.main.select_job.options[selected].value;
        var found = false;
        if (select_value == '0')
        {
            //display hidden field
	    var message = document.main.jobNumber.value;
            if (message != "")
            {
                //var arr = message.split("~");
                for (var i = 0; i < document.main.select_job.length; i++)
                {
                    sel_assert("job_select 3", (i));
                    if (message == document.main.select_job.options[i].value)
                    {
                        document.main.select_job.options[i].selected;
                        document.main.jobNumber.value = message;
                        found = true;
                    }
                }
                if (!found)
                {
                    document.main.jobNumber.value = message;
		    /* NOT FOR SHOP GUYS
		    load_activity_list(document.main.jobNumber.value);
		    */
                }
            } else
            {
                document.main.jobNumber.value = "";
            }
        }
        else
        {
            document.main.jobNumber.value = select_value;
		updateMade();
		/* NOT FOR SHOP GUYS
	      load_activity_list(document.main.jobNumber.value);
	      */
//	      load_mark_list(document.main.jobNumber.value);
	    timesheetLookup.validatejobno1(document.main.jobNumber, document.main.job_name);
            document.main.mark.focus();
	    //imageChange unsaved data
            changeMade = 1;
        }
    }

    /////////////////////////////////////////////////////////////////////////
    //EVENTS
    /////////////////////////////////////////////////////////////////////////
    function block_all(e)
    {
        set_update_time();
        if (sockets_active == true) 
        {
            return false;
        } else
        {
            return true;
        }
    }

    //
    //On key down capturing for the memo and activity fields to prevent the
    //input of "~"
    //


    //
    //Submit cookie data with form
    //
//    document.main.textname.value=nameid;
//    document.main.textemplid.value=clockid;
//    document.main.textdeptid.value=deptid;
