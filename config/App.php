<?php
class App {

	public static function db()
	{
		return new DB\SQL(
			'mysql:host=localhost;port=3306;dbname=het',
			'root',
			''
		);
	}

}