<?php
/**
 * REST API Sarana Pelayanan
 */
class SaranaPelayanan extends AbstractModel
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
    }

    public function checkByCode($kode='')
    {
    	$result = App::db()->exec('SELECT * FROM sarana_pelayanan WHERE kode_sarana = :kode_sarana',
    							  array('kode_sarana' => $kode));
    	return !empty($result);
    }
}