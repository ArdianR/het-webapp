<?php
/**
 * REST API Het
 */
class Het extends AbstractModel
{
    public $het;

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
        if (!empty($result))
            $this->het = $result[0]['het'];

    	return !empty($result);
    }
}