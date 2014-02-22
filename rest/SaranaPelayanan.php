<?php
/**
 * REST API Sarana Pelayanan
 */
class SaranaPelayanan extends AbstractModel
{

	function __construct($params = array())
	{
		parent::__construct(array(
            'tableName' => 'sarana_pelayanan',
            'primaryKey' => 'id'
        ));
	}

    public function lists($f3) {
    	$this->jsonList($f3, 'v_list_sarana',  'nama ASC');
    }

    public function checkByCode($kode='')
    {
    	$result = App::db()->exec('SELECT * FROM sarana_pelayanan WHERE kode_sarana = :kode_sarana',
    							  array('kode_sarana' => $kode));
    	return !empty($result);
    }
}