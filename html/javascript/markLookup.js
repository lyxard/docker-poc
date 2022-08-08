var timesheetLookup = (function() {


  return {

    writeToScreen: function(message) {
      console.log(message);
    },

    activityListLoaded: false,
    known_jobs: new Array(),
  
    // Called from timesheet2.0.pl
 
    validatejobno1: function(job_number, job_name) {

    if ( specialAct == true ) {
	//Don't change it.
    	job_number.value = deptid; // + ".01";
        if ( deptid == 4 || clockid == 2614 ) {
    	    document.main.proj.value = "";
        }
    	return;
    }

    var found = false;

    if ( isNaN(job_number)
    	 || job_number == '') {
    	 alert("Job number must be a numeric value.");
    	 jobError = true;
    } else if ( job_number < 2 ) {
    	 alert("Job number must be a numeric value of 2 or greater.");
    	 jobError = true;
    } else {
    	jobError = false;
    }

    if ( jobError == false ) {
    	var dot = false;
    	var afterdot = "";
    	var number = job_number;

    	for ( var j=0; j<number.length; j++ ) {
    	    if ( dot == false ) {
    	    	if ( number.charAt(j) == '.' ) {
    	    	    dot = true;
    	    	}
    	    } else{
    	    	afterdot += number.charAt(j);
    	    }
    	}
    	if ( afterdot.length == 0 || afterdot.length > 2 ) {
    	    if ( dot == true ) {
		if(number.length <=6)
	    	    	job_number.value = (number); // + "01");
		else
	    	    	job_number.value = (number); // + "00");
    	    } else{
		if(number.length <=6)
    	    		job_number.value = (number); // + ".01");
		else
    	    		job_number.value = (number); // + ".00");
			
    	    }
    	    updateMade();
    	}
    	if ( afterdot.length == 1 ) {
    	    job_number.value = (number); // + "0");
	    updateMade();
    	}
    }

    for ( var i=0; i<document.main.select_job.length; i++) {
    	// Update select box
    	// sel_assert("validatejobno 1", (i));
    	if ( job_number.value ==
    	     document.main.select_job.options[i].value ) {

    	     // Load up the job description field
    	     document.main.select_job.options[i].selected = true;
    	     found = true;
    	     break;
    	}
    }

    if ( !found ) {
    	document.main.select_job.options[0].selected = true;
    }
    if ( jobError == false ) {
    
        timesheetLookup.setup_job_validation_callback1(job_number, job_name);
    }

    },

    //
    // Set up ajax validation to take place in job_validation_callback1()
    //
  
    setup_job_validation_callback1: function(job_number, field_name) {
  
        var ajaxRequest;
        	
        try {
          // Most browsers
          ajaxRequest = new XMLHttpRequest();
        } catch (e){
          // Internet Explorer Browsers
          try{
            ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
          } catch (e) {
            try{
              ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e){
              // Something went wrong
              alert("Unsupported browser");
              return false;
            }
          }
        }
        ajaxRequest.onreadystatechange = function(){
          if (ajaxRequest.readyState == 4) {
            //timesheetLookup.writeToScreen("job name: " + ajaxRequest.responseText);
            eval( ajaxRequest.responseText );
          }
        }
        //timesheetLookup.jobNameFieldName = job_name;
        timesheetLookup.field_name = field_name;
        timesheetLookup.job_number = job_number;
        var job_phase = job_number.split('.');

        ajaxRequest.open("GET", "/cgi-bin/timesheet_lookup.pl?task=job_validation1&callback=timesheetLookup.job_validation_callback1&job=" + job_phase[0] + "&phase=1", true);
        ajaxRequest.send(null); 
    },
   
    //
    // Handle ajax validation when the data returned is eval'ed
    //
  
    job_validation_callback1: function(json) {
        var error = false;
        var line = json.data;
        var job_name = "";
  
        //timesheetLookup.writeToScreen("data: " + line);
        code = line.substring(0, 3);
  
        if ( code == "200" ) {
            error = false;
            result = line.substring(3, line.length);
            var res = new Array();
            result = result + "";
            eval(result);
            if ( res[0][1] > "1970-01-01" ) {
                    alert("The Job No. is valid but the job is closed.\n" + "You cannot enter time for a closed job.");
                    //setTimeout('document.main.jobNumber.focus()',10);
                    badRecord = true;
                    return;
            }
            job_name = res[0][0];
	    update_display(job_name, timesheetLookup.job_number, timesheetLookup.field_name); 
	    return job_name;
        } else if (code=="199") {
            alert("There is a problem with job validation.  Please contact your System Administrator.");
            //setTimeout('document.main.jobNumber.focus()',10);
            jobError = true;
	    validation_error();
            badRecord = true;
            return;
        } else if (code == "197") {
	    invalid_job();
            error = true;
	    return false;
        }
    },

    // Called from job_validation.pl

    validatejobnoX: function(job_number, job_name) {
      var found = false;
      if ( isNaN(job_number.value) ) {
        alert("The Job No. must be a numeric value.");
        jobError = true;
      } else if ( job_number.value=='' ) {
        job_number.value = "";
        jobError = true;
      } else {
        jobError = false;
      }
      if ( jobError == false ) {
        var job_phase = job_number.value.split('.');
    
        if ( (job_phase[0] == 100 || job_phase[0] == '100')
          && (job_phase[1] == 1 || job_phase[1] == '01') ) {
    
          // Handle non-ajax validation now
    
          job_name.value = 'Service Order';
    
        } else {
    
          // Else set up ajax validation to take place in job_validation_callback()
    
          timesheetLookup.setup_job_validation_callbackX(job_number, job_name);
        }
      }
    },
    
    //
    // Set up ajax validation to take place in job_validation_callbackX()
    //
  
    setup_job_validation_callbackX: function(job_number, job_name) {
  
        var ajaxRequest;
        	
        try {
          // Most browsers
          ajaxRequest = new XMLHttpRequest();
        } catch (e){
          // Internet Explorer Browsers
          try{
            ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
          } catch (e) {
            try{
              ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e){
              // Something went wrong
              alert("Unsupported browser");
              return false;
            }
          }
        }
        ajaxRequest.onreadystatechange = function(){
          if (ajaxRequest.readyState == 4) {
            //timesheetLookup.writeToScreen("job name: " + ajaxRequest.responseText);
            eval( ajaxRequest.responseText );
          }
        }
        timesheetLookup.jobNameFieldName = job_name;

        ajaxRequest.open("GET", "/cgi-bin/timesheet_lookup.pl?task=job_validationX&callback=timesheetLookup.job_validation_callbackX&job=" + job_number.value, true);
        ajaxRequest.send(null); 
    },


    //
    // Handle ajax validation when the data returned is eval'ed
    //
  
    job_validation_callbackX: function(json) {
        var error = false;
        var line = json.data;
        var job_name = "";
  
        //timesheetLookup.writeToScreen("data: " + line);
        code = line.substring(0, 3);
  
        if ( code == "200" ) {
          error = false;
          result = line.substring(3, line.length);
          var res = new Array();
          result = result + "";
          eval(result);
          job_name = res[0][0];
        } else if ( code == "199" ) {
          alert("There is a problem with job validation.  Please contact your System Administrator.");
          // TODO
          setTimeout('job_field.focus()',10);
          jobError = true;
          return;
        } else if ( code == "197" ) {
          error = true;
        }
        if ( error == true ) {
          alert("The Job No. is not a valid Profitool job number.");
          // TODO
          setTimeout('job_field.focus()',10);
        }
  
        timesheetLookup.jobNameFieldName.value = job_name;
    },

    // Called from timesheet2.0.pl
 
    activity_list1: function(job) {
        if ( document.main.jobNumber.value == '100.01' ) {
	     timesheetLookup.service_activity1(document.main.activity.value);
	     return;
        }
        if ( job == '' ) {
	     return;
        }
        if ( job == 'default' ) {
             preloaded_list('2', 'default');
	     return;
        }
        if ( typeof timesheetLookup.known_jobs[job] != "undefined" ) {
             preloaded_list(timesheetLookup.known_jobs[job]);
	     return;
        }
        
        timesheetLookup.setup_activity_list_callback1(job);

    },

    //
    // Set up ajax validation to take place in activity_list_callback1()
    //
  
    setup_activity_list_callback1: function(job) {

        var ajaxRequest;
        	
        try {
          // Most browsers
          ajaxRequest = new XMLHttpRequest();
        } catch (e){
          // Internet Explorer Browsers
          try{
            ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
          } catch (e) {
            try{
              ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e){
              // Something went wrong
              alert("Unsupported browser");
              return false;
            }
          }
        }
        ajaxRequest.onreadystatechange = function(){
          if (ajaxRequest.readyState == 4) {
            eval( ajaxRequest.responseText );
          }
        }

        timesheetLookup.job = job;
        ajaxRequest.open("GET", "/cgi-bin/timesheet_lookup.pl?task=activity_list1&callback=timesheetLookup.activity_list_callback1&code=100&job=" + job, true);
        ajaxRequest.send(null); 

    },

    //
    // Handle ajax validation when the data returned is eval'ed
    //
  
    activity_list_callback1: function(json) {
        var error = false;
        var line = json.data;
        // TODO Must be shared.
        //var known_jobs = new Array();
        var job = timesheetLookup.job;
        //timesheetLookup.writeToScreen("data: " + line);

        var code;
 	code = line.substring(0, 4);
        if ( code =="199 " ) {
             alert(line);
             return;
        }
        line = line.substring(4, line.length);
        var list_name = line;
        timesheetLookup.list_name = list_name;
        if ( code=="201 " ) {
                  timesheetLookup.activityListLoaded = true;
             if ( check_preloaded(list_name) == true ) {
	          timesheetLookup.known_jobs[job] = list_name;
                  preloaded_list(list_name);
                  timesheetLookup.activityListLoaded = true;
                  return;
             }
        } else {
             // Error
             return;
        }
        timesheetLookup.activity_list_data1(job, list_name);
    },

    activity_list_data1: function(job, list_name) {
        
        timesheetLookup.setup_activity_list_data_callback1(job, list_name);
    },

    //
    // Set up ajax validation to take place in activity_list_callback1()
    //
  
    setup_activity_list_data_callback1: function(job, list_name) {

        var ajaxRequest;
        	
        try {
          // Most browsers
          ajaxRequest = new XMLHttpRequest();
        } catch (e){
          // Internet Explorer Browsers
          try{
            ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
          } catch (e) {
            try{
              ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e){
              // Something went wrong
              alert("Unsupported browser");
              return false;
            }
          }
        }
        ajaxRequest.onreadystatechange = function(){
          if (ajaxRequest.readyState == 4) {
            eval( ajaxRequest.responseText );
          }
        }

        ajaxRequest.open("GET", "/cgi-bin/timesheet_lookup.pl?task=activity_list1&callback=timesheetLookup.activity_list_data_callback1&code=202&job=" + job + "&list=" + list_name, true);
        ajaxRequest.send(null); 

    },

    //
    // Handle ajax validation when the data returned is eval'ed
    //
  
    activity_list_data_callback1: function(json) {
        var error = false;
        var line = json.data;
        var job = timesheetLookup.job;
        var list_name = timesheetLookup.list_name;
        var result = new Array();
  
        //timesheetLookup.writeToScreen("data: " + line);

        var code;
 	code = line.substring(0, 4);
        
	line = String(line);

        if (code=="199 ") {
            alert(line);
            return;
        }
	line = line.substring(4, line.length);

        line = line + "";
        line = line.replace(/~~~/g, "\n");
        eval(line);
        document.main.select_act.options.length = 0;
	document.main.select_act.options[0] =
        new Option("(Cost Code)", "Cost Code", true, true);
	
	timesheetLookup.known_jobs[job] = list_name;
        preloaded_activity_lists[list_name] = new Array();

        for ( var i = 0; i < result.length; i++ ) {
            preloaded_activity_lists[list_name][i] =
                new Array(result[i][0], result[i][1]);
            document.main.select_act.options[document.main.select_act.options.length] = new Option(result[i][1] + " - " + result[i][0], result[i][1], false, false);
        }
        timesheetLookup.activityListLoaded = true;
    },

    // Called from grid_timesheet.js
 
    service_activity1: function(job) {
        
        // Clear select list
        document.main.select_act.options.length = 0;
        document.main.select_act.options[0] =
	new Option("(Cost Code)", "Cost Code", true, true);

        if ( document.main.activity.value == '' ) { return; }

        timesheetLookup.setup_service_activity_callback1(job);

    },

    //
    // Set up ajax validation to take place in service_activity_callback1()
    //
  
    setup_service_activity_callback1: function(activity) {

        var ajaxRequest;
        	
        try {
          // Most browsers
          ajaxRequest = new XMLHttpRequest();
        } catch (e){
          // Internet Explorer Browsers
          try{
            ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
          } catch (e) {
            try{
              ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e){
              // Something went wrong
              alert("Unsupported browser");
              return false;
            }
          }
        }
        ajaxRequest.onreadystatechange = function(){
          if (ajaxRequest.readyState == 4) {
            eval( ajaxRequest.responseText );
          }
        }

        timesheetLookup.activity = activity;
        ajaxRequest.open("GET", "/cgi-bin/timesheet_lookup.pl?task=service_activity_validation1&callback=timesheetLookup.service_activity_callback1&activity=" + activity, true);
        ajaxRequest.send(null); 

    },

    //
    // Handle ajax validation when the data returned is eval'ed
    //
  
    service_activity_callback1: function(json) {
        var line = json.data;
        var result;
        var code;
        var error;

        line = String(line);
        if ( line.length < 4) { error = true; }

        code = line.substring(0, 3);

        if ( code =="200") {
	    error = false;
	    line = String(line);
	    result = line.substring(3, line.length);
	    var res = new Array();
	    result = result + "";
	    eval(result);
	    if ( res[0][0] == 0 || res[0][0] == '0' ) {
	        alert("This is not a valid Service Order Number.");
	        //setTimeout('document.main.activity.focus()',10);
	    } else {
                timesheetLookup.service_order1(timesheetLookup.activity);
	    }
        } else if ( code == "199" || code=="197" ) {
	    alert("There is a problem with activity validation.  Please contact your System Administrator.");
	    //setTimeout('document.main.activity.focus()',10);
        }
    },

    service_order1: function(activity) {
        
        timesheetLookup.setup_service_order_callback1(activity);
    },

    //
    // Set up ajax validation to take place in service_activity_validation1()
    //
  
    setup_service_order_callback1: function(activity) {

        var ajaxRequest;
        	
        try {
          // Most browsers
          ajaxRequest = new XMLHttpRequest();
        } catch (e){
          // Internet Explorer Browsers
          try{
            ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
          } catch (e) {
            try{
              ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e){
              // Something went wrong
              alert("Unsupported browser");
              return false;
            }
          }
        }
        ajaxRequest.onreadystatechange = function(){
          if (ajaxRequest.readyState == 4) {
            eval( ajaxRequest.responseText );
          }
        }

        ajaxRequest.open("GET", "/cgi-bin/timesheet_lookup.pl?task=service_order_validation1&callback=timesheetLookup.service_order_callback1&activity=" + activity, true);
        ajaxRequest.send(null); 

    },

    //
    // Handle ajax validation when the data returned is eval'ed
    //
  
    service_order_callback1: function(json) {
        var error = false;
        var line = json.data;
        var result;
  
	line = String(line);
	result = line.substring(3, line.length);
	res = new Array();
	result = result + "";
console.log('result: %s', result);
	eval(result);

	document.main.select_act.options[0] =
	new Option(document.main.activity.value + " " +res[0][0], "Cost Code", true, true);
	document.main.select_act.options[0].selected = true;
    },
    mark_list1: function(job) {
        
        timesheetLookup.setup_mark_list_callback1(job);

    },

    //
    // Set up ajax validation to take place in mark_list_callback1()
    //
  
    setup_mark_list_callback1: function(job) {

        var ajaxRequest;
        	
        try {
          // Most browsers
          ajaxRequest = new XMLHttpRequest();
        } catch (e){
          // Internet Explorer Browsers
          try{
            ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
          } catch (e) {
            try{
              ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e){
              // Something went wrong
              alert("Unsupported browser");
              return false;
            }
          }
        }
        ajaxRequest.onreadystatechange = function(){
          if (ajaxRequest.readyState == 4) {
            eval( ajaxRequest.responseText );
          }
        }

        timesheetLookup.job = job;
        ajaxRequest.open("GET", "/cgi-bin/timesheet_lookup.pl?task=mark_list1&callback=timesheetLookup.mark_list_callback1&code=100&job=" + job, true);
        ajaxRequest.send(null); 

    },

    //
    // Handle ajax validation when the data returned is eval'ed
    //
  
    mark_list_callback1: function(json) {
	var error = false;
        var line = json.data;
        // TODO Must be shared.
        //var known_jobs = new Array();
        var job = timesheetLookup.job;
        //timesheetLookup.writeToScreen("data: " + line);

        var code;
 	code = line.substring(0, 4);
        if ( code =="199 " ) {
             alert(line);
             return;
        }
        line = line.substring(4, line.length);
        var mark_list_name = line;
        timesheetLookup.mark_list_name = mark_list_name;
        if ( code=="200 " ) {
        	timesheetLookup.mark_list_data1(job, mark_list_name);
        } else {
             // Error
             return;
        }
    },

    mark_list_data1: function(job, list_name) {
        
        timesheetLookup.setup_mark_list_data_callback1(job, list_name);
    },

    //
    // Set up ajax validation to take place in activity_list_callback1()
    //
  
    setup_mark_list_data_callback1: function(job, list_name) {

        var ajaxRequest;
        	
        try {
          // Most browsers
          ajaxRequest = new XMLHttpRequest();
        } catch (e){
          // Internet Explorer Browsers
          try{
            ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
          } catch (e) {
            try{
              ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e){
              // Something went wrong
              alert("Unsupported browser");
              return false;
            }
          }
        }
        ajaxRequest.onreadystatechange = function(){
          if (ajaxRequest.readyState == 4) {
            eval( ajaxRequest.responseText );
          }
        }

        ajaxRequest.open("GET", "/cgi-bin/timesheet_lookup.pl?task=mark_list1&callback=timesheetLookup.mark_list_data_callback1&code=202&job=" + job,true);// + "&list=" + list_name, true);
        ajaxRequest.send(null); 

    },

    //
    // Handle ajax validation when the data returned is eval'ed
    //
  
    mark_list_data_callback1: function(json) {
        var error = false;
        var line = json.data;
        var job = timesheetLookup.job;
        var list_name = timesheetLookup.mark_list_name;
        var result = new Array();
  
        //timesheetLookup.writeToScreen("data: " + line);

        var code;
 	code = line.substring(0, 4);
        
	line = String(line);

        if (code=="199 ") {
            alert(line);
            return;
        }
	line = line.substring(4, line.length);

        line = line + "";
        line = line.replace(/~~~/g, "\n");
        eval(line);
        document.main.select_mark.options.length = 0;
	document.main.select_mark.options[0] =
        new Option("(Mark)", "Mark", true, true);
	timesheetLookup.known_jobs[job] = list_name;
        preloaded_activity_lists[list_name] = new Array();

        for ( var i = 0; i < result.length; i++ ) {
            preloaded_activity_lists[list_name][i] =
                new Array(result[i][0], result[i][1]);
            document.main.select_mark.options[document.main.select_mark.options.length] = new Option(result[i][1] + " - " + result[i][0], result[i][1], false, false);
        }
        timesheetLookup.activityListLoaded = true;
	validate_mark(true);
    },
 
  }; 
})();

