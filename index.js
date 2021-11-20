const http = require("http"), // Подключаем файл или библиотеку
    crud = require("./crud");

const echo = (res, content) => {
    res.end(JSON.stringify(content)); //Закрываем поток и дописываем доп. данные
}
const student = (req, res) => {
    res.writeHead(200, {"Content-type": "application/json"}); // Отправляет код состояния 200 (OK) и
                                                              // записывает данные из json
    const url = req.url.substring(1).split("/"); // В url создается массив, начиная с 1 элемента
                                                         // (убирается лишняя "/" в начале, элементы массива
                                                         //  разделяются через "/"
    switch (req.method) { // Определяет метод запроса (GET POST PUT...)
        case "GET": // Получаем данные обо всех студентах
            if (url.length > 1) // Если есть "/id" после student, получаем его
                echo(res, crud.get(url[1]));
            else
                echo(res, crud.getAll()); // Если нет "/id" после student, получаем все
            break;
        case "POST": // Добавление
            getAsyncData(req, data => {
                echo(res, crud.create(JSON.parse(data))); // Передаем объект
            });
            break;
        case "PUT": // Изменение
            getAsyncData(req, data => {
                echo(res, crud.update(JSON.parse(data)));
            });
            break;
        case "DELETE": // Удаление
            if (url.length > 1)
                echo(res, crud.delete(url[1])); // Если есть "/id" после student, удаляем с этим id
            else
                echo(res, {"error": "Не передан id"}); // Если удаляем без "/id" после student,
            break;
    }
}
const getAsyncData = (req, callback) => {
    let data = "";
    // .on связывает функцию chunk с датой, то есть пока данные поступают на серве
    req.on("data", chunk => {
        data += chunk; // Добавляем введенные строчки их json
    }); // Событие data генерируется, когда данные поступают на серве
    req.on("end", () => {
        callback(data); // Когда все пришло, то вызывает data
    }); // end генерируется, когда все данные прибыли
}

const handler = function (req, res) {
    const url = req.url.substring(1).split("/");
    console.log(url);
    switch (url[0]) {
        case "student": // Если первый url после localhost "/student"
            student(req, res); // То вызываем функцию
            return;
        case "": // Если первого url после localhost нет
            res.end("index"); // То выдаем ответ index
            return;
    }
    console.log("AFTER SWITCH");
    console.log(req.url);
    console.log(req.method);
    res.end("echo"); // Завершает поток с ответом echo
}

http.createServer(handler).listen(8090, () => { // Создание сервера с портом и
                                                // функцией handler
    console.log("run");
})

// http://localhost:8090/student
