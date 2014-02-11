<?php
$f3 = require('lib/base.php');
$f3->set('AUTOLOAD', 'rest/;config/');
$f3->set('DEBUG',3);

$f3->route('GET /',
	function($f3)
	{
		echo View::instance()->render('index.html');
	}
);

$f3->route('GET @sms_pelaporan_het: /sms_gateway/pelaporan_het',	'SmsGateway->pelaporan_het');

/*******************************************************************************
 * Rest Route
 *******************************************************************************/
$f3->map('		@pengawas: 				/pengawas/@id',				'Pengawas');
$f3->route('GET	@pengawas_list: 		/pengawas',					'Pengawas->lists');

$f3->map('		@pelaporanHet: 			/pelaporan_het/@id',		'PelaporanHet');
$f3->route('GET @pelaporan_list: 		/pelaporan_het',			'PelaporanHet->lists');

$f3->map('		@saranaPelayanan: 		/sarana_pelayanan/@id',		'SaranaPelayanan');
$f3->route('GET @saranaPelayanan_list: 	/sarana_pelayanan',			'SaranaPelayanan->lists');

$f3->map('		@het: 					/het/@id',					'Het');
$f3->route('GET @het_list: 				/het',						'Het->lists');

$f3->run();