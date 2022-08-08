var strColorOn = '#c6e7de';
    var strColorOff = '#ffffff';

    function GetHexValue(strRGBColor)
    {
       var aryRGBValues;
       var strR;
       var strG;
       var strB;
       var strHexValue;

       strRGBColor = strRGBColor.replace(/\s*/g, '');
       strRGBColor = strRGBColor.replace(/rgb\(|\)/g, '');
       aryRGBValues = strRGBColor.split(',');
       strR = aryRGBValues[0];
       strG = aryRGBValues[1];
       strB = aryRGBValues[2];
       strHexValue = '#' + RGBtoHex(strR, strG, strB)
       return strHexValue.toLowerCase();
    }

    function RGBtoHex(strR, strG, strB)
    {
       var intR = strR * 1;
       var intG = strG * 1;
       var intB = strB * 1;
       return intR.toString(16) + intG.toString(16) + intB.toString(16)
    }

    function ToggleTimeslot(tdTimeslot)
    {
      var strBackgroundColor;

      if (tdTimeslot.style.backgroundColor == 'undefined' || tdTimeslot.style.backgroundColor == 'null' || tdTimeslot.style.backgroundColor == '')
      {
        tdTimeslot.style.backgroundColor = strColorOn;
        return;
      }
      strBackgroundColor = tdTimeslot.style.backgroundColor;
      if (strBackgroundColor.substr(0,1) != '#')
      {
        strBackgroundColor = GetHexValue(strBackgroundColor);
      }
      if (strBackgroundColor == strColorOff)
      {
        tdTimeslot.style.backgroundColor = strColorOn;
      }
      else
      {
        tdTimeslot.style.backgroundColor = strColorOff;
      }
    }

    function GetTimeSlotValue(intTimeslot, strStartOrEnd)
    {
      var strTimeslot;

      switch(intTimeslot)
      {
        case 1:
          if (strStartOrEnd == 'start')
          {
            strTimeslot = '9:00';
          }
          else
          {
            strTimeslot = '9:30';
          }
          break;
        case 2:
          if (strStartOrEnd == 'start')
          {
            strTimeslot = '9:30';
          }
          else
          {
            strTimeslot = '10:00';
          }
          break;
        case 3:
          if (strStartOrEnd == 'start')
          {
            strTimeslot = '10:00';
          }
          else
          {
            strTimeslot = '10:30';
          }
          break;
        case 4:
          if (strStartOrEnd == 'start')
          {
            strTimeslot = '10:30';
          }
          else
          {
            strTimeslot = '11:00';
          }
          break;
        case 5:
          if (strStartOrEnd == 'start')
          {
            strTimeslot = '11:00';
          }
          else
          {
            strTimeslot = '11:30';
          }
          break;
        case 6:
          if (strStartOrEnd == 'start')
          {
            strTimeslot = '11:30';
          }
          else
          {
            strTimeslot = '12:00';
          }
          break;
        case 7:
          if (strStartOrEnd == 'start')
          {
            strTimeslot = '12:00';
          }
          else
          {
            strTimeslot = '12:30';
          }
          break;
        case 8:
          if (strStartOrEnd == 'start')
          {
            strTimeslot = '12:30';
          }
          else
          {
            strTimeslot = '1:00';
          }
          break;
        case 9:
          if (strStartOrEnd == 'start')
          {
            strTimeslot = '1:00';
          }
          else
          {
            strTimeslot = '1:30';
          }
          break;
        case 10:
          if (strStartOrEnd == 'start')
          {
            strTimeslot = '1:30';
          }
          else
          {
            strTimeslot = '2:00';
          }
          break;
        case 11:
          if (strStartOrEnd == 'start')
          {
            strTimeslot = '2:00';
          }
          else
          {
            strTimeslot = '2:30';
          }
          break;
        case 12:
          if (strStartOrEnd == 'start')
          {
            strTimeslot = '2:30';
          }
          else
          {
            strTimeslot = '3:00';
          }
          break;
        case 13:
          if (strStartOrEnd == 'start')
          {
            strTimeslot = '3:00';
          }
          else
          {
            strTimeslot = '3:30';
          }
          break;
        case 14:
          if (strStartOrEnd == 'start')
          {
            strTimeslot = '3:30';
          }
          else
          {
            strTimeslot = '4:00';
          }
          break;
        case 15:
          if (strStartOrEnd == 'start')
          {
            strTimeslot = '4:00';
          }
          else
          {
            strTimeslot = '4:30';
          }
          break;
        case 16:
          if (strStartOrEnd == 'start')
          {
            strTimeslot = '4:30';
          }
          else
          {
            strTimeslot = '5:00';
          }
          break;
        default:
          strTimeslot = '';
      }
      return strTimeslot;
    }

    function GetSelectedTimeslots(strDay)
    {
      var strTimeslots = '';
      var intLastSelectedTimeslot = -1;
      var strBackgroundColor;
      var intCounter;
      var intNumOfTimeslots = 16;

      intCounter = 1;
      while (intCounter <= intNumOfTimeslots)
      {
        strBackgroundColor = document.getElementById('td' + strDay + intCounter).style.backgroundColor;
        if (strBackgroundColor.substr(0,1) != '#')
        {
          strBackgroundColor = GetHexValue(strBackgroundColor);
        }
        if (strBackgroundColor == strColorOn)
        {
          if (intCounter != (intLastSelectedTimeslot + 1))
          {
            strTimeslots = strTimeslots + GetTimeSlotValue(intCounter, 'start');
          }
          intLastSelectedTimeslot = intCounter;
        }
        else
        {
          if (intCounter == (intLastSelectedTimeslot + 1))
          {
            strTimeslots = strTimeslots + '-' + GetTimeSlotValue(intLastSelectedTimeslot, 'end') + ', ';
          }
        }
        intCounter++
      }
      if (intLastSelectedTimeslot == intNumOfTimeslots)
      {
        strTimeslots = strTimeslots + '-' + GetTimeSlotValue(intLastSelectedTimeslot, 'end') + ', ';
      }
      strTimeslots = strTimeslots.substr(0, (strTimeslots.length - 2));
      if (strTimeslots == '-')
      {
        strTimeslots = '';
      }
      return strTimeslots;
    }

    function ViewSelectedTimeslots()
    {
      var strMessage = '';

      strMessage = 'The following timeslots have been selected:' + '\n\n';
      strMessage = strMessage + 'Mon: ' + GetSelectedTimeslots('Mon') + '\n';
      strMessage = strMessage + 'Tue: ' + GetSelectedTimeslots('Tue') + '\n';
      strMessage = strMessage + 'Wed: ' + GetSelectedTimeslots('Wed') + '\n';
      strMessage = strMessage + 'Thu: ' + GetSelectedTimeslots('Thu') + '\n';
      strMessage = strMessage + 'Fri: ' + GetSelectedTimeslots('Fri');
      alert(strMessage);
    }
