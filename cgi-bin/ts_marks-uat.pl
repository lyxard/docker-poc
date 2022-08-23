#!/usr/bin/perl -w
# name:     ts_marks.pl
# process:  Allows the user to update/edit marks for the Shop
#           Timesheet System
# author:   Becky Alcorn
# revision: $Id$

use strict;
use CGI;
use CGI::Carp qw(fatalsToBrowser);
use CGI::Session::Login;
use Unisolve::Config;
#
# External perl files
#
require 'get_acco_ip.pl';
require 'connect_db_ts.pl';

# Step 1. Initialize
sub head($$);
sub body($$);
sub update_marks($);
sub end();

my $q = new CGI;
(my $rev = '$Revision: 1.0 $') =~ s/\$//g;
my $session = CGI::Session::Login->new(cgi => $q, url => $ENV{SCRIPT_NAME});
exit 0 if (!$session->login());

#getting cofig data;
my $config_file = "shop_timesheet.conf";
my $config = Unisolve::Config->new(
           conffile => $config_file,
 );
my $conf_error = $config->check_config(['database', 'db_user', 'db_password']);


my ($ip, $webpt_ip, $external_webpt_ip) = get_acco_ip();
my $revision = "1.0";

my $employee_id;
my ($username, $full_name, $department);


my $job = $q->param('job');

# Read in text
$ENV{'REQUEST_METHOD'} =~ tr/a-z/A-Z/;
if ($ENV{'REQUEST_METHOD'} eq "POST"){
   update_marks($q);
}


# The head we put out in any case
head($session, $ip);
body($ip, $job);
end();
exit 0;

#-------------------------------------------------------------
# Subroutines

sub head($$) {
    my ($session, $ip) = @_;
    ($username, $employee_id, $full_name, $department) = $session->get_username();

    print $session->header();
print<<"EOT";
<?xml version="1.0" encoding="iso-8859-1"?>
<!DOCTYPE html
PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
 "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en-US" xml:lang="en-US">
<head>
<title>Marks</title>
</head>

<SCRIPT LANGUAGE="JavaScript">
var changeMade = 0;
var notSaved = 0;

function loaded(){
    if(navigator.appName != "Netscape")
        alert("The Marks page requires Mozilla to function properly.\\n "+
                "Please re-open the Marks page with Mozilla.");

    if(noRecords){
        newRecord();
    }
    else
    {
        var tempBody = document.getElementById('dataTable');
        var lastLine = tempBody.childNodes.length;

        selectRecord(lastRecord());
        enableButtons();
    }
    document.main.code.focus();
}
function unload_page() {
    var changeWarning =
      "There appear to be pending changes that have not \\n" +
      "yet been saved. These will be lost if you continue. \\n" +
      "Do you wish to ignore the changes?";
    // The page will remain loaded if they click on cancel
}

</script>

<!--<script type="text/javascript" src="/javascript/grid_timesheet.js"></script>
-->

<STYLE type="text/css">
body
{
   background-color: #FFF;
}
div
{
   border: none;
   background-color: #dddddd;
   width: 556px;
}
.GRID
{
   overflow: auto;
   height: 194px;
   width:  554px;
}
table
{
   background-color: #FFF;
}
tr
{
   BACKGROUND-COLOR: #FFF;
}
.hdtxt{
    display: none;
    vislble: false;
}

</style>
EOT
}

sub body($$){
    my ($ip, $job) = @_;

    my ($dbh, $error) = connect_db_ts($config->{database}, $config->{username}, $config->{password}, $config->{host});
    die $error if ($error);

print<<"EOT";

<body onload = "loaded();" onunload="unload_page()";>
<script language="Javascript">
var headerData = new Array("No.","Code","Description");
var headerDataLen = new Array("45px","80px","399px");
var cellAlign = new Array("center","center","center");
var tData = "";
var fileData = "";
EOT

get_ts_marks($dbh, $job);

print<<"EOT";

var tableData = "";
var fileTableData = "";
var noRecords = false;
var notValidated = false;
var badRecord = false;

if(tData!=""){
    // Take out ending "~"
    tData = tData.substring(0,tData.length-1);

    // Put into Array
    tableData = tData.split("~");
}
else{
    noRecords = true;
}

var tableHeadColor = "#cccccc";
var tableDataColor = "#FFFFCC";
var highlightColor = "#F3FF00";

// Initialise total arrays
var theDate = new Date();
var theLine = 1;
var dateError = false;
var minError = false;
var jobError = false;
var actError = false;
var hourError = false;
var typeAct = 0;
var specialAct = false;
var reimburseAct = false;

var logo1 = new Image();
var logo2 = new Image();
var logo3 = new Image();

logo1.src = "/images/acc_org.jpg";
logo2.src = "/images/acc_grid_green.jpg";
logo3.src = "/images/acc_grid_red.jpg";

var table;
var tablebody;
var row;
var cell;

function createHeader(header){
    table = document.createElement("TABLE");
    tablebody = document.createElement("TBODY");
    row = document.createElement("TR");
    for(var i = 0; i < header.length; i++) {
        cell = document.createElement("TD");
        cell.setAttribute("width",headerDataLen[i]);
        cell.setAttribute("align","center");
        cell.style.backgroundColor = tableHeadColor;
        //cell.style.fontWeight = "bold";
        cell.appendChild(document.createTextNode(header[i]));
        row.appendChild(cell);
    }

    cell = document.createElement("TD");
    cell.setAttribute("width","5px");
    cell.setAttribute("align","center");
    cell.setAttribute("id","rowData");
    cell.style.backgroundColor = tableDataColor;
    cell.appendChild(document.createTextNode("RowId"));
    cell.className = "hdtxt";

    row.appendChild(cell);
    tablebody.appendChild(row);
    table.appendChild(tablebody);
    document.getElementsByTagName("div").item(0).appendChild(table);
}

function buildbody(appendToId, data, header){
    table = document.createElement("TABLE");

    if(data!=""){

    tablebody = document.createElement("TBODY");
    tablebody.setAttribute("id","dataTable");

    for(var i = 0; i < data.length;) {
        row = document.createElement("TR");
        for(var j = 0; j < header.length; j++) {
            cell = document.createElement("TD");
            cell.setAttribute("width",headerDataLen[j]);
            cell.setAttribute("align",cellAlign[j]);
            cell.setAttribute("id","rowData");
            cell.style.backgroundColor = tableDataColor;
            if(j == 0){
                cell.appendChild(document.createTextNode(tablebody.childNodes.length+1));
                i++;
            }
            else{
                cell.appendChild(document.createTextNode(data[i++]));
            }
            row.appendChild(cell);
        }

        cell = document.createElement("TD");
        cell.setAttribute("width","5px");
        cell.setAttribute("align","center");
        cell.setAttribute("id","rowData");
        cell.style.backgroundColor = tableDataColor;
        cell.appendChild(document.createTextNode(data[i++]));
        cell.className = "hdtxt";

        row.appendChild(cell);
        tablebody.appendChild(row);
    }
    table.appendChild(tablebody);
   }
   document.getElementById("divList").appendChild(table);
}

document.onmousedown = buttonDown;

var currRow="";
var lastRow="";
function buttonDown(e) {
    var e_id = e.target.getAttribute("id");
    if(! e_id)
        return true;
    if(e_id == "")
        return true;

    // Record selected
    if(e_id == "rowData"){
        selectRecord(e.target.parentNode.firstChild.firstChild.nodeValue);
    }
    if(e_id == "saveRec"){
        saveRecord();
    }
    if(e_id == "addRec"){
        newRecord();
    }
    if(e_id == "delRec")
        delRecord();
    if(e_id == "canRec")
        cancelRecord();

    return true;
}
function selectRecord(row){
    var scrollAmt = 0;
    for(var j=0; j<row-1; j++){
        scrollAmt += document.getElementsByTagName("tr").item(j+6).scrollHeight+2;
    }
    var divSize;
        divSize = 194;
    var currNum = parseInt(row)+5;
    if(!(scrollAmt+2>document.getElementById('divList').scrollTop &&
        (scrollAmt<document.getElementById('divList').scrollTop+divSize)))
        document.getElementById('divList').scrollTop = scrollAmt;
    if((scrollAmt+document.getElementsByTagName("tr").item(currNum).scrollHeight) >
        document.getElementById('divList').scrollTop+divSize)
        document.getElementById('divList').scrollTop =
                scrollAmt + document.getElementsByTagName("tr").item(currNum).scrollHeight - divSize;
    specialAct = false;
    currRow = row;
    tablebody=document.getElementById('dataTable');
    // highlight selected row
    for(var i=0; i<headerData.length; i++){
        if(lastRow != "")
            tablebody.childNodes[lastRow-1].childNodes[i].style.backgroundColor = tableDataColor;
        tablebody.childNodes[row-1].childNodes[i].style.backgroundColor = highlightColor;
    }

    lastRow = row;

    // assign values
    document.main.No.value = tablebody.childNodes[row-1].childNodes[0].firstChild.nodeValue;
    document.main.code.value = tablebody.childNodes[row-1].childNodes[1].firstChild.nodeValue;
    document.main.description.value = tablebody.childNodes[row-1].childNodes[2].firstChild.nodeValue;
    document.main.Id.value = tablebody.childNodes[row-1].childNodes[3].firstChild.nodeValue;
    document.main.job.value = '$job';
    document.main.actiontype.value = "upd";

}

function disableButtons(){
    document.main.delRec.disabled = true;
    document.main.canRec.disabled = false;
}

function enableButtons(){
    document.main.delRec.disabled = false;
    document.main.canRec.disabled = true;
}


function delRecord(){
    document.main.actiontype.value = "del";
    document.main.submit();
}

function lastRecord(){
    if(!noRecords){
        var tempBody = document.getElementById('dataTable');
        return tempBody.childNodes.length;
    }
    return 0;
}
function addRecord(){
  document.main.submit();
}

function removeQuotes(value){
    var temp = value.replace("\\"","\\'\\'");
    temp = temp.replace("\\\\"," ");
    return temp;
}

function newRecord(){
    specialAct = false;
    for(var i=0; i<headerData.length; i++){
        if(lastRow != "")
            tablebody.childNodes[lastRow-1].childNodes[i].style.backgroundColor = tableDataColor;
    }
    disableButtons();

    document.main.code.value = "";
    document.main.description.value = "";
    //document.main.code.focus();
    document.main.actiontype.value = "add";
    document.main.job.value = '$job';
    document.main.Id.value = '0';
}

function saveRecord(){
  document.main.submit();
}

function cancelRecord(){
  selectRecord(lastRecord());
  enableButtons();
}


function back_to_menu() {
  document.location = "/cgi-bin/marks_maintenance.pl";
}
function logOut()
{
    var exp = new Date();
    exp.setTime (exp.getTime() - 1);
    var cval = GetCookie ('CGISESSID');
    document.cookie ='CGISESSID' + "=" + cval + "; expires=" + exp.toGMTString();
    document.location= "http://$ip/cgi-bin/marks_maintenance.pl";
}
function display(ImageName, filename)
{
    document[ImageName].src = window[filename].src;
}
</script>
<form name="info">
    <table width="640px">
        <tr>
          <td>
              <a href="http://$ip/" >
                <img height="50" src="https://$ip/images/insideaccoImages/accoLogoClr.gif" border="0"></img>
              </a>
          </td>
          <td>
              <center><font size="5"><b>Marks</b></font></center>
          </td>
          <td align="right">
             <input type="button" id="backToMenu" value="Back" onClick="back_to_menu()" />
             <input type="button" id="logOutButton" value="Log Out" onFocus="document.main.No.focus();" onClick="logOut();"/><br>
          </td>
        </tr>
        <tr>
            <td colspan="6">
              <br>
            </td>
        </tr>
        <tr>
           <td>
              Job:&nbsp;<b>$job</b>
           </td>
          <td>
          </td>
        </tr>
    </table>
</form>
 <div bgcolor=white>
 <script language = "Javascript">
    createHeader(headerData);
 </script>
  </div>
    <script language="Javascript">
            document.write("<div class='GRID' id=divList bgcolor=white>");
    </script>
    <script language = "Javascript">
        buildbody("", tableData, headerData);
    </script>
    </div>
<br>

<form name="main" method="post">
<table>
  <tr>
    <td>
        Line #
    </td>
    <td>
        <input type="text" size="10" id="No" name="No" onblur='validateLine();'> </input>
    </td>
  </tr>
  <tr>
    <td>
        Code
    </td>
    <td>
        <input type="text" size="10" id="code" name="code"  maxlength="10"></input>
    </td>
  </tr>
  <tr>
    <td>
        Description
    </td>
    <td>
        <input type="text" id="description" name="description" size="60"></input>
    </td>
 </tr>
 <tr>
  <td>
     <input type="hidden" id="Id" name="Id"></input>
     <input type="hidden" id="actiontype" name="actiontype" />
     <input type="hidden" id="job" name="job" value="$job" />
     <input type="button" id="addRec" value="Add" onFocus="document.main.No.focus();" />
  </td>
   <td>
     <input type="button" id="canRec" value="Cancel" OnClick="cancelRecord()" disabled />
     <input type="button" id="delRec" value="Delete" onFocus="document.main.No.focus();" disabled />
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
     <font size="2">Marks ver. # $revision</font>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
     <input type="button" id="saveRec" value="Save Data"  onFocus="document.main.No.focus();"></input>
  </td>
</tr>
</table>
EOT

# Get the lists that are to be preloaded

print <<"EOT";
<input type="hidden" name="textemplid" value="$employee_id">
</form>
EOT
  $dbh->disconnect();
}

sub end(){
print << "EOT";
</BODY>
<script language="Javascript">
    var sockets_active=false;
    document.main.description.onkeypress= block_tilda;
    document.onkeypress = block_all;
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
    function block_all(e)
    {
        if (sockets_active == true)
        {
            return false;
        } else
        {
            return true;
        }
    }

    //document.main.No.onkeypress=block_plus_and_minus_line;
    function block_plus_and_minus_line(e)
    {
        var keyChar = String.fromCharCode(e.which);
        var currNo = document.main.No.value;
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

    function change_line(oldLine, lines)
    {
        var tempBody = document.getElementById("dataTable");
        var lastLine = tempBody.lastChild.firstChild.firstChild.nodeValue;

        if ((oldLine == "1" && lines < 0) || (oldLine == 1 && lines < 0))
        {
            alert("Cannot go below Line number 1.");
            document.main.No.focus();
        } else
        {
            changeMade = 1;
            if (document.main.code.value == "")
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

    function validateLine(){
        var currNo = document.main.No.value;
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
        else if((currNo.search(/\./)) != -1 && (currNo.search(/\./)) !=0)
        {
            alert("The Line number can not be a decimal.");
            return false;
        } else
        {
            if(document.main.No.value > lastRecord()){
                newRecord();
            }
            else{
                selectRecord(document.main.No.value);
            }
            //return false;
            return true;
        }
    }

</script>
</HTML>
EOT
}

sub get_ts_marks($$) {
  my ($dbh, $job) = @_;

  my $sth = $dbh->prepare("
    SELECT line, code, description, Id
      FROM marks
     WHERE job_phase = ?
  ORDER BY line
  ");

  $sth->execute("$job");
  my %marks;
  while (my $res = $sth->fetchrow_hashref) {
    print <<"EOT";
    tData += "$res->{line}~$res->{code}~$res->{description}~$res->{Id}~";
EOT
  }
}

sub update_marks($) {
  my ($q) = @_;
  my $cgi = new CGI;

  my $job = $q->param('job');
  my $No = $q->param('No');
  my $code = $q->param('code');
  my $desc = $q->param('description');
  my $Id = $q->param('Id');
  my $action = $q->param('actiontype');

  my ($dbh, $error) = connect_db_ts($config->{database}, $config->{username}, $config->{password}, $config->{host});
    die $error if ($error);

 my $sth = $dbh->prepare('Call update_Marks(?,?,?,?,?,?)');
 $sth->execute($action, $Id, $No, $job,$code, $desc);

 $dbh->disconnect();

  print $cgi->redirect(
         -uri => "https://$ip$ENV{SCRIPT_NAME}?job=$job",
        -status => 303
  );

}