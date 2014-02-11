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
		$phone_number = $_GET['phone'];
		$sms_center = isset($_GET['sms_center']) ? $_GET['sms_center'] : '';
		$message = isset($_GET['message']) ? $_GET['message'] : '';

		//terdaftar
		$daftar = App::db()->exec('SELECT * FROM pengawas WHERE no_hp = :no_hp',
								  array(':no_hp' => $phone_number))[0];

		$error = 0;

		if (!empty($daftar)) {
			//proses parsing message
			$parseSMS = explode('_', $message);

			if (count($parseSMS) == 3) {

				$het = new Het();
				$sarana = new SaranaPelayanan();

				if ($het->checkByCode($parseSMS[0])) {
					if ($sarana->checkByCode($parseSMS[1])) {

						$kode = App::db()->exec('SELECT * FROM v_id_het_sarana WHERE kode_obat = :kode_obat AND kode_sarana = :kode_sarana',
												array(':kode_obat'=>$parseSMS[0], ':kode_sarana'=>$parseSMS[1]))[0];

						$pelaporan = new DB\SQL\Mapper(App::db(), 'pelaporan_het');
						$pelaporan->id_het = $kode['id_het'];
						$pelaporan->id_sarana_pelayanan = $kode['id_sarana_pelayanan'];
						$pelaporan->harga = $parseSMS[2];
						$pelaporan->save();

						$message = 'Pelaporan tersimpan';
					} else {
						$message = 'Kode sarana tidak terdaftar';
						$error = 4;
					}
				} else {

					$message = 'Kode obat tidak terdaftar';
					$error = 3;
				}
			} else {
				$message = 'Format SMS Harus KODEOBAT_KODESARANA_HARGA';
				$error = 2;
			}
		} else {
			$message = 'Normor Tidak terdaftar';
			$error = 1;
		}
		//masukin ke log
		$logSms = new DB\SQL\Mapper(App::db(), 'log_sms');
		$logSms->phone_number = $phone_number;
		$logSms->message = $parseSMS[1];
		$logSms->sms_center = $sms_center;
		$logSms->error = $error;
		$logSms->save();

		$url = (string)"http://192.168.43.1:9090/sendsms?phone=".$phone_number."&text=".$message.'&password=';

		//kirim sms
		$sms = file_get_contents($url);
		echo $message;
		echo $sms;
	}
}