<?php
/**
 * REST API Het
 */
class Het extends AbstractModel
{

	function __construct($params = array())
	{
		parent::__construct($params);
	}

	public function post()
	{
		# code...
	}

	public function put() {

	}

    public function delete() {

    }

    public function lists() {
    	$result = App::db()->exec('SELECT * FROM v_het_pelaporan');
    	echo json_encode($result);
    }

    public function checkByCode($kode) {
    	$result = App::db()->exec('SELECT * FROM het WHERE kode_obat = :kode_obat',
    							  array('kode_obat' => $kode));
    	return !empty($result);
    }
}