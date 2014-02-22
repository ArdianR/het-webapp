<?php
/**
 *	Rest API Pengawas
 */
class Pengawas extends AbstractModel
{

	function __construct($params = array())
	{
		parent::__construct(array(
            'tableName' => 'pengawas',
            'primaryKey' => 'id'
        ));
	}

    public function lists($f3) {
    	$this->jsonList($f3, 'pengawas',  'nama ASC');
    }

    public function combo($f3)
    {
        $this->jsonList($f3, 'v_combo_pengawas',  'nama_pengawas ASC');
    }
}