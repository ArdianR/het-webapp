<?php
/**
 * REST API Pelaporan HET
 */
class PelaporanHet extends AbstractModel
{

	function __construct($params = array())
	{
		parent::__construct($params);
	}

	public function get($f3, $params)
	{
		$result = App::db()->exec('SELECT * FROM v_pelaporan_het WHERE id_het = :id_het',
								  array('id_het' => $params['id']));
		echo json_encode($result);
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
    	$result = App::db()->exec('SELECT * FROM pelaporan_het');
    	echo json_encode($result);
    }
}