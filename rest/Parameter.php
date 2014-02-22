<?php
/**
 *	Rest API Pengawas
 */
class Parameter extends AbstractModel
{
	function __construct($params = array())
	{
		parent::__construct(array(
            'tableName' => 'parameter',
            'primaryKey' => 'id'
        ));
	}

    public function getParameter($kode) {
        $parameter = App::db()->exec('SELECT isi FROM parameter WHERE kode = ?', $kode);
        if(!empty($parameter)) {
            return $parameter[0]['isi'];
        } else {
            return false;
        }
    }

    public function lists($f3) {
    	$this->jsonList($f3, 'parameter',  'kode ASC');
    }
}