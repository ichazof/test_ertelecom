<?php
namespace Workers;

define('DB_DSN', 'mysql:dbname=rtelecom;host=localhost;charset=utf8');
define('DB_USER', 'root');
define('DB_PASSWD', '');
use PDO;

class Workers
{
    private $lastId;
    public function create($data)
    {
        if (isset($data["surname"], $data["name"], $data["name2"], $data["title"], $data["type"], $data["phone"], $data["mail"])) {
            $phone = array_reduce($data["phone"], function ($carry, $item) {
                return $carry . $item . ";";
            }, "");
            $mail = array_reduce($data["mail"], function ($carry, $item) {
                return $carry . $item . ";";
            }, "");
            $query = "INSERT INTO `workers` (`id`, `name`, `surname`, `name2`, `title`, `type`, `phones`, `emails`) VALUES 
            (NULL, ?, ?, ?, ?, ?, ?, ?);";
            try {
                $pdo = $this->connect();

                $statement = $pdo->prepare($query);
                $statement->execute([$data["name"], $data["surname"], $data["name2"], $data["title"], $data["type"], $phone, $mail]);
                $lastId = $pdo->lastInsertId();
                $pdo = NULL;
            } catch (Exception $e) {

                echo json_encode(array(
                    "status" => "error",
                    "message" => $e->getMessage(),
                ));
                // writeToLog($e->getMessage(), "ERROR");
            }

            echo json_encode(array(
                "status" => "ok",
                "data" => $lastId,
            ));
        } else {
            echo json_encode(array(
                "status" => "error",
                "message" => "Не все данные получены",
            ));
        }
    }



    public function get()
    {
        if ($stmt = $this->doQuery("SELECT * FROM `workers`")) {
            $arr = array();
            while ($row = $stmt->fetch()) {
                $phones = array_filter(explode(";", $row["phones"]), function ($element) {
                    return !empty($element);
                });
                $mails = array_filter(explode(";", $row["emails"]), function ($element) {
                    return !empty($element);
                });
                // writeToLog($row["phones"], "ERROR");
                $newRow = array(
                    "id" => $row["id"],
                    "name" => $row["name"],
                    "name2" => $row["name2"],
                    "surname" => $row["surname"],
                    "title" => $row["title"],
                    "type" => $row["type"],
                    "phones" => $phones,
                    "mails" => $mails
                );
                $arr[] = $newRow;
            }
            echo json_encode($arr);
        } else {
            $arr = array(
                "error" => "Ошибка"

            );
            echo json_encode($arr);
        }
    }
    public function delete($data)
    {
        if (isset($data, $data["id"])) {
            $query = "DELETE FROM `workers` WHERE `workers`.`id` = ?";
            try {
                $pdo = $this->connect();
                $statement = $pdo->prepare($query);
                $statement->execute([$data["id"]]);
                $pdo = NULL;
            } catch (Exception $e) {

                echo json_encode(array(
                    "status" => "error",
                    "message" => $e->getMessage(),
                ));
                // writeToLog($e->getMessage(), "ERROR");
            }

            echo json_encode(array(
                "status" => "ok",
            ));
        } else {
            echo json_encode(array(
                "status" => "error",
                "message" => "Не все данные получены",
            ));
        }
    }
    public function edit($data)
    {
        if (isset($data["surname"], $data["name"], $data["name2"], $data["title"], $data["type"], $data["phone"], $data["mail"], $data["id"])) {
            $phone = array_reduce($data["phone"], function ($carry, $item) {
                return $carry . $item . ";";
            }, "");
            $mail = array_reduce($data["mail"], function ($carry, $item) {
                return $carry . $item . ";";
            }, "");
            $query = "UPDATE `workers` SET `name` = ? , `surname` = ? , `name2` = ? , `title` = ? , `type` = ? , `phones` = ? , `emails` = ? WHERE `workers`.`id` = ?;";
            try {
                $pdo = $this->connect();
                $statement = $pdo->prepare($query);
                $statement->execute([$data["name"], $data["surname"], $data["name2"], $data["title"], $data["type"], $phone, $mail, $data["id"]]);
                $pdo = NULL;
            } catch (Exception $e) {

                echo json_encode(array(
                    "status" => "error",
                    "message" => $e->getMessage(),
                ));
                // writeToLog($e->getMessage(), "ERROR");
            }

            echo json_encode(array(
                "status" => "ok",
            ));
        } else {
            echo json_encode(array(
                "status" => "error",
                "message" => "Не все данные получены",
            ));
        }
    }
    private function doQuery($query)
    {
        // writeToLog($query);
        try {
            $pdo = new PDO(DB_DSN, DB_USER, DB_PASSWD);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            if ($stmt = $pdo->query($query)) {
                $this->lastId = $pdo->lastInsertId();
            }
            $pdo = NULL;
        } catch (Exception $e) {
            echo "<pre>";
            print_r('Ошибочка: ' . $e->getMessage());
            echo "</pre>";
            // writeToLog($e->getMessage(), "ERROR");
        }
        return $stmt;
    }
    private function connect()
    {
        try {
            $pdo = new PDO(DB_DSN, DB_USER, DB_PASSWD);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (Exception $e) {
            echo json_encode(array(
                "status" => "error",
                "message" => $e->getMessage(),
            ));
            exit();
        }
        return $pdo;
    }
}
