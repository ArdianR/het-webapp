<?php
/**
 *	Rest API Pengawas
 */
class LogSMS extends AbstractModel
{

	function __construct($params = array())
	{
		parent::__construct(array(
            'tableName' => 'log_sms',
            'primaryKey' => 'id'
        ));
	}

    public function lists($f3) {
    	$this->jsonList($f3, 'log_sms',  'stamp DESC');
    }
}