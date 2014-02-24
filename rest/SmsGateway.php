<?php
/**
*
*/
class SmsGateway extends AbstractModel
{

	function __construct($argument)
	{
		parent::__construct($argument);
	}

	public function pelaporan_het($f3)
	{
		$phone_number = isset($_GET['phone']) ? (string) str_replace(' ', '+', $_GET['phone']) : '';
		$sms_center = isset($_GET['sms_center']) ? (string) $_GET['sms_center'] : '';
		$message = isset($_GET['text']) ? (string) $_GET['text'] : '';

		//terdaftar
		$daftar = App::db()->exec('SELECT sp.id AS id_sarana_pelayanan FROM pengawas p INNER JOIN sarana_pelayanan sp ON p.id = sp.id_pengawas WHERE no_hp = :no_hp',
								  array(':no_hp' => $phone_number));
		if (!empty($daftar))
			$daftar = $daftar[0];

		$error = 0;

		if (!empty($daftar)) {
			//proses parsing message
			$parseSMS = explode('_', $message);

			if (count($parseSMS) == 2) {

				if (is_numeric($parseSMS[1]) && (int)$parseSMS[1] > 0) {
					$het = new Het();
					$sarana = new SaranaPelayanan();

					if ($het->checkByCode($parseSMS[0])) {
							$kode = App::db()->exec('SELECT * FROM v_id_het_sarana WHERE kode_obat = :kode_obat',
													array(':kode_obat'=>$parseSMS[0]));
							$kode = $kode[0];
							if ($het->het < $parseSMS[1]) {
								$pelaporan = new DB\SQL\Mapper(App::db(), 'pelaporan_het');
								$pelaporan->id_het = $kode['id_het'];
								$pelaporan->id_sarana_pelayanan = $daftar['id_sarana_pelayanan'];
								$pelaporan->harga = $parseSMS[1];
								$pelaporan->save();
								$response = 'Pelaporan tersimpan';
							} else {
								$response = 'Harga Obat sesuai dengan het';
								$error = 5;
							}
					} else {
						$response = 'Kode obat tidak terdaftar';
						$error = 4;
					}
				} else {
					$response = 'Format harga harus harga dan lebih besar dari 0';
					$error = 3;
				}
			} else {
				$response = 'Format SMS Harus KODEOBAT_HARGA';
				$error = 2;
			}
		} else {
			$response = 'Nomor Tidak terdaftar';
			$error = 1;
		}
		//masukin ke log
		$logSms = new DB\SQL\Mapper(App::db(), 'log_sms');
		$logSms->phone_number = $phone_number;
		$logSms->message = $message;
		$logSms->sms_center = $sms_center;
		$logSms->error = $error;
		$logSms->save();

		$parameter = new Parameter();
		$url_sms_gateway = $parameter->getParameter('SMS_GATE_WAY_URL');

		if ($url_sms_gateway) {
			$opts = array(
			  'http'=>array(
			    'method'=>"GET",
			    'header'=>"Accept-language: en\r\n"
			  )
			);
			$context = stream_context_create($opts);
			$url = (string) 'http://'. $url_sms_gateway .'/sendsms?phone='.urlencode($phone_number).'&text='.urlencode($response).'&password=';

			//kirim sms
			//echo $response;
			$sms = file_get_contents($url, false, $context);
		} else {
			echo "SMS Gatewy error";
		}
	}
}