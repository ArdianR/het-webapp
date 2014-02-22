<?php
/**
 * REST API Het
 */
class Het extends AbstractModel
{
	function __construct($params = array())
	{
		parent::__construct(array(
            'tableName' => 'het',
            'primaryKey' => 'id'
        ));
	}

    public function lists($f3) {
        $this->jsonList($f3, 'v_het_pelaporan', 'nama_obat ASC');
    }

    public function checkByCode($kode) {
    	$result = App::db()->exec('SELECT * FROM het WHERE kode_obat = :kode_obat',
    							  array('kode_obat' => $kode));
        if (!empty($result))
            $this->het = $result[0]['het'];

    	return !empty($result);
    }
}