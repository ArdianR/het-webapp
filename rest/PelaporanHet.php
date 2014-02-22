<?php
/**
 * REST API Pelaporan HET
 */
class PelaporanHet extends AbstractModel
{

	function __construct($params = array())
	{
		parent::__construct(array(
            'tableName' => 'pelaporan_het',
            'primaryKey' => 'id'
        ));
	}

    public function get($f3, $params) {
        $this->jsonList($f3, 'v_list_pelaporan_het',  'nama_sarana ASC', array('id_het = ?', $params['id']));
    }

    public function lists($f3) {
    	$this->jsonList($f3, 'v_list_pelaporan_het',  'nama_sarana ASC');
    }
}