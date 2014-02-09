<?php
$f3 = require('lib/base.php');
$f3->set('AUTOLOAD','rest/');
$f3->set('DEBUG',3);

$f3->route('GET /',
	function($f3)
	{
		echo View::instance()->render('index.html');
	}
);

/*******************************************************************************
 * Rest Route
 *******************************************************************************/
$f3->map('		@pengawas: 				/pengawas/@id',				'Pengawas');
$f3->route('GET	@pengawas_list: 		/pengawas',					'Pengawas->lists');

$f3->map('		@pelaporHet: 			/pelapor_het/@id',			'PelaporHet');
$f3->route('GET @pelapor_list: 			/pelapor_het/',				'PelaporHet->lists');

$f3->map('		@saranaPelayanan: 		/sarana_pelayanan/@id',		'SaranaPelayanan');
$f3->route('GET @saranaPelayanan_list: 	/sarana_pelayanan/',		'SaranaPelayanan->lists');

$f3->map('		@het: 					/het/@id',					'Pengawas');
$f3->route('GET @het_list: 				/het/',						'Pengawas->lists');

$f3->run();