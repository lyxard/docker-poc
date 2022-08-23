# name:     shop_timesheet_common.pl
# process:  Provides subroutines used by more than one shop timesheet program
# author:   Becky Alcorn

use Unisolve::Config;
sub get_conf() {
  my $conffile = 'shop_timesheet.conf';
  my $conf = Unisolve::Config->new(conffile => $conffile);
  my $err = $conf->check_config(['database', 'username', 'password', 'ptdw_database']);
  die ($err) if ($err);
  return $conf;

}

sub hardcoded_activities() {
  return {
    200.00 => "Sheet Metal Work",
    201.00 => "Hangers & Supports",
    202.00 => "Clips & Closures",
    203.00 => "Rectangular Straight Duct",
    204.00 => "Rectangular Fittings",
    205.00 => "Round Fittings",
    206.00 => "Spiral Duct",
    208.00 => "Plenums",
    209.00 => "Specialities",
    210.00 => "Small Dampers / Quads",
    211.00 => "Galv SM & Coils",
    212.00 => "Oval Fittings",
    213.00 => "Oval Ductwork",
    214.00 => "Duct Sealing",
    215.00 => "Duct Sectioning",
    217.00 => "Purchased Duct / Raw  Mtl",
    218.00 => "Stockpiled Ductwork",
    219.00 => "Shop Detailing & Management",
    219.50 => "Sheet Metal Shop Total",
    220.00 => "Welded Duct",
    222.00 => "Welded Stainless Steel Duct",
    224.00 => "Specialities",
    225.00 => "Sound Traps",
    226.00 => "Structural Supports",
    227.00 => "Fire & Smoke Dampers",
    228.00 => "Control Dampers",
    229.00 => "Terminals",
    229.50 => "Welding Shop Total",
    230.00 => "Lined Straight Duct",
    231.00 => "Lined Fittings",
    231.50 => "Lining Shop Total",
    235.00 => "Fiberglass Straight Duct",
    236.00 => "Fiberglass Fittings",
    239.00 => "Material Handling",
    239.50 => "Fiberglass Duct Total",
    240.00 => "Duct Cleaning & Bagging",
    241.00 => "Shop Assembly Duct",
    242.00 => "Pre-Insulated Duct",
    243.00 => "Fabricated Flex Duct",
    245.00 => "Parts & Supplies",
    245.50 => "Miscellaneous Duct Total",
    246.00 => "Driving Labor",
    247.00 => "Loading Labor",
    248.00 => "Material Handling",
    249.00 => "Internal Maintenance & Repairs",
    251.00 => "General Field SM Labor",
    254.00 => "CAD Detailing",
    259.00 => "CAD Coordination",
    261.00 => "Duct Sectioning",
    267.00 => "Risers",
    273.00 => "General Tenant Work",
    292.00 => "General Foreman",
    293.00 => "Job Coordination",
    299.00 => "Special Labor",
    311.00 => "Piping (Driving & Loading)",
    338.00 => "Process Piping (Driving & Loading)",
    370.00 => "Plumbing (Driving & Loading)",
    589.00 => "Safety",
    704.00 => "Supervision",
    715.00 => "Clerical",
    866.00 => "Training",
  };
}


1;

#-------------------------------------------------------------
# $Log$
