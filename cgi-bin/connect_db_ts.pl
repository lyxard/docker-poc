#!/usr/bin/perl -w
# name:     connect_db_ts.pl
# process:  Provide a single entry point for database connection.
# author:   Simon Taylor
# revision: $Id: connect_db_ts.pl,v 1.0 2000/09/11 00:48:06 bianca Exp $

sub connect_db_ts ($$$) {
my ($database, $user, $password, $host) = @_;

my $driver   = "mysql";
my $options  = "";
my $dbs;
my $dbh;
    # Establish the data source name

    $dsn = "DBI:$driver:database=$database;host=$host";
    # Establish the database handle
    $dbh = DBI->connect($dsn, $user, $password, {
        RaiseError => 0,
        PrintError => 0
    } );
    return ($dbh, DBI::err());
}
1;

#------------------------------------------------------------------------------
# $Log: connect_db_ts.pl,v $
# Revision 1.0  2000/09/11 00:48:06  bianca
# Initial revision
#

