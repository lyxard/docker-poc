#!/usr/bin/perl -w
# name:     $RCSfile: get_acco_ip.pl,v $
# process:  Returns the ip address to use for this machine, and also the ip
#	    address to use for webpt connections
# author:   Becky Alcorn
# revision: $Id: get_acco_ip.pl,v 1.2 2003/07/19 19:38:42 staylor Exp $

sub get_acco_ip() {
    require "shop_timesheet_common.pl";
    my $conf = get_conf();

    my $remote_addr = $ENV{REMOTE_ADDR};
    my $http_host = $ENV{HTTP_HOST};
    die "REMOTE_ADDR variable not set" if (!$remote_addr || $remote_addr =~ m/^\s*$/);
    die "HTTP_HOST variable not set" if (!$http_host || $http_host =~ m/^\s*$/);
    my $ip;
    my $webpt_ip;
    my $external_webpt_ip;
    if ($remote_addr =~ m/^172/) {
	$ip = '172.16.0.30';
	$webpt_ip = '172.16.0.30';
	$external_webpt_ip = '172.16.0.30';
    } elsif ($remote_addr =~ m/^210.15.236.166$/) {
	# From Unisolve
	if ($http_host =~ m/insideacco/ || $http_host =~ m/^207.0.52.5$/) {
	    $ip = '67.153.183.8';
	} else {
	    $ip = '67.153.183.9';
	}
	$external_webpt_ip = '67.153.183.5';
	$webpt_ip = '10.100.1.200';
    } else {
	$ip = $http_host;
	$webpt_ip = '$conf->{pt_server}';
	$external_webpt_ip = '$conf->{pt_server}';
    }
    return ($ip, $webpt_ip, $external_webpt_ip);
}
1;
