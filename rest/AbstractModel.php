<?php
/**
 * Model abstrak untuk semua class model
 */
class AbstractModel
{
	public $tableName = '';
	public $primarKey = '';

	function __construct($params)
	{
		foreach ($params as $key => $value) {
			$this->$key = $value;
		}
		//check pk & primary
		try {
			$this->propertyNotEmpty('tableName');
			$this->propertyNotEmpty('primaryKey');
		} catch (Exception $e) {
			echo 'Error: ',  $e->getMessage(), "\n";
		}
	}

	private function propertyNotEmpty($value) {
		if (isset($this->value)) {
			if (empty($this->value)) {
				throw new Exception('Nilai '.$value.' Kosong, silahkan isi saat inisialisasi model.');
			}
		}
		else {
			return true;
		}
	}


	public function get($f3, $params)
	{
	    $this->jsonGet($params['id']);
	}

	public function post($f3, $params)
	{
		$f3->set('model', new DB\SQL\Mapper(App::db(), $this->tableName));
		$model = $f3->get('model');

		$data = json_decode($f3->get('BODY'));
		foreach ($model->fields as $key => $value) {
			if ($key != $this->primaryKey)
				$model->$key = $data->$key;
		}
		$f3->get('model')->save();

		echo json_encode(array(
		    'success' => true,
		    'message' => 'Simpan Berhasil'
		));
	}

	public function put($f3, $params) {
		$f3->set('model', new DB\SQL\Mapper(App::db(), $this->tableName));

		if ($f3->get('model')->load(array($this->primaryKey . '=?', $params['id']))) {
			// $f3->get('model')->copyFrom('POST');
			$model = $f3->get('model');

			// $data = json_decode(file_get_contents("php://input")); NOT WORKING USE THIS:
			$data = json_decode($f3->get('BODY'));
			foreach ($model->fields as $key => $value) {
				$model->$key = $data->$key;
			}
			$f3->get('model')->save();

			echo json_encode(array(
			    'success' => true,
			    'message' => 'Simpan Berhasil'
			));
		} else {
			$f3->error(404);
		}
	}

	public function delete($f3, $params) {
		$model = new DB\SQL\Mapper(App::db(), $this->tableName);
        $model->load(array($this->primaryKey . ' = ?', $params['id']));

        if ($model->erase()) {
            echo json_encode(array(
                'success' => true,
                'message' => 'Hapus berhasil'
            ));
        } else {
            echo json_encode(array(
                'success' => false,
                'message' => 'Hapus Gagal'
            ));
        }
	}

	public function jsonGet($id, $params = array())
	{
		if (empty($params)) {
			$result = App::db()->exec('SELECT * FROM ' . $this->tableName . ' WHERE id = :id',
									  array(':id' => $id));
		} else {
			$result = App::db()->exec('SELECT * FROM ' . $params['view'] . ' WHERE ' . $params['where'],
									  $params['bindParam']);
		}
		echo json_encode($result);
	}

	public function jsonList($f3, $view, $order, $options = null)
	{
		$start = $f3->get('GET.start');
        $limit = $f3->get('GET.limit');
        $query = $f3->get('GET.query');
        $fields = json_decode($f3->get('GET.fields'));

        $meta  = array();

        if (!empty($start)) {
            $meta['offset'] = $start;
        } else {
            $meta['offset'] = 0;
        }

        if (!empty($limit)) {
            $meta['limit'] = $limit;
        } else {
            $meta['limit'] = 20;
        }

        if (!empty($query)) {
        	$options = array();
        	$options[0] = '';
        	$length  = count($fields);

        	for($i = 0; $i < $length; $i++) {
        		$options[0] .= $fields[$i] . ' LIKE ?';

        		if ($i < $length - 1)
        			$options[0] .= ' OR ';

        		$options[] = '%'.$query.'%';
        	}
        }

        $meta['order'] = $order;

        $model = new DB\SQL\Mapper(App::db(), $view);
        $model->load($options, $meta);

        $result = array();
        while(!$model->dry()) {
            $result[] = $model->cast();
            $model->next();
        }

    	echo json_encode(array(
            'success' => true,
            'results' => $result,
            'total' => $model->count()
        ));
	}
}