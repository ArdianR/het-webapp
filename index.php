    <?php
    ini_set("allow_url_fopen", true);

    $f3 = require('lib/base.php');
    $f3->set('AUTOLOAD', 'rest/;config/');
    $f3->set('DEBUG',3);

    $f3->route('GET /',
        function($f3)
        {
            echo View::instance()->render('index.html');
        }
    );

    $f3->route('GET @sms_pelaporan_het: /sms_gateway/pelaporan_het',    'SmsGateway->pelaporan_het');

    /*******************************************************************************
     * Rest Route
     *******************************************************************************/
    $f3->route('GET     /het',                      'Het->lists');
    $f3->route('POST    /het',                      'Het->post');
    $f3->route('GET     /het/@id',                  'Het->get');
    $f3->route('PUT     /het/@id',                  'Het->put');
    $f3->route('DELETE  /het/@id',                  'Het->delete');

    $f3->route('GET     /pelaporan_het',            'PelaporanHet->lists');
    $f3->route('POST    /pelaporan_het',            'PelaporanHet->post');
    $f3->route('GET     /pelaporan_het/@id',        'PelaporanHet->get');
    $f3->route('PUT     /pelaporan_het/@id',        'PelaporanHet->put');
    $f3->route('DELETE  /pelaporan_het/@id',        'PelaporanHet->delete');

    $f3->route('GET     /sarana_pelayanan',         'SaranaPelayanan->lists');
    $f3->route('POST    /sarana_pelayanan',         'SaranaPelayanan->post');
    $f3->route('GET     /sarana_pelayanan/@id',     'SaranaPelayanan->get');
    $f3->route('PUT     /sarana_pelayanan/@id',     'SaranaPelayanan->put');
    $f3->route('DELETE  /sarana_pelayanan/@id',     'SaranaPelayanan->delete');

    $f3->route('GET     /pengawas',                 'Pengawas->lists');
    $f3->route('POST    /pengawas',                 'Pengawas->post');
    $f3->route('GET     /pengawas/combo',           'Pengawas->combo');
    $f3->route('GET     /pengawas/@id',             'Pengawas->get');
    $f3->route('PUT     /pengawas/@id',             'Pengawas->put');
    $f3->route('DELETE  /pengawas/@id',             'Pengawas->delete');

    $f3->route('GET     /log_sms',                  'LogSMS->lists');
    $f3->route('POST    /log_sms',                  'LogSMS->post');
    $f3->route('GET     /log_sms/@id',              'LogSMS->get');
    $f3->route('PUT     /log_sms/@id',              'LogSMS->put');
    $f3->route('DELETE  /log_sms/@id',              'LogSMS->delete');

    $f3->route('GET     /parameter',                'Parameter->lists');
    $f3->route('POST    /parameter',                'Parameter->post');
    $f3->route('GET     /parameter/@id',            'Parameter->get');
    $f3->route('PUT     /parameter/@id',            'Parameter->put');
    $f3->route('DELETE  /parameter/@id',            'Parameter->delete');

    $f3->run();