$(function() {
	var t0 = performance.now();
var server = 'http://192.168.10.247:8081/'; //Адрес web-сервера qsystem	var remoteServer = 'http://terminal:dhe8fbak@sko3-terminal.e-health.kz/'; //Адрес сервера записи онлайн
	//var point = 1;//номер терминала по умолчанию
	//lang = 1; русский
	//lang = 2; казахский
	/**
	* Обновляет страницу в заданное время
	*/
	function refreshAt(hours, minutes, seconds) {
	    var now = new Date();
	    var then = new Date();
	    if(now.getHours() > hours ||
	       (now.getHours() == hours && now.getMinutes() > minutes) ||
	        now.getHours() == hours && now.getMinutes() == minutes && now.getSeconds() >= seconds) {
	        then.setDate(now.getDate() + 1);
	    }
	    then.setHours(hours);
	    then.setMinutes(minutes);
	    then.setSeconds(seconds);
	    var timeout = (then.getTime() - now.getTime());
	    setTimeout(function() { window.location.reload(); }, timeout);
	}
	/**
	* Обновляет LocalStorage, сбрасывает счетчик напечатанных талонов
	*/
	function refreshLocalStorage() {
		if (localStorage.getItem('today') == null) {
			let today = new Date().setHours(0,0,0,0);
			localStorage.setItem('today', today);
		}
		else {
			let oldDateVal = localStorage.getItem('today');
			let now = new Date().setHours(0,0,0,0);
			if(now > oldDateVal){
				console.log("очищаем весь сторейдж");
				localStorage.clear();
			}
		}
	}
	/**
     * Преобразовывает строку в формат даты/времени
     * @param {строка в виде 'hh:mm:ss'} time 
     * @param {объект даты JS} date 
    */
    var timeToDate = function (time, date) {
        var chunks = time.split(':');
        date.setHours(Number(chunks[0]));
        date.setMinutes(Number(chunks[1]));
        return date;
    }
	/**
	* Сравнивает текущее время и время в параметре
	*/
	function compareTimes(time){
		var now = new Date();
		var curTime = now.getTime(); 
		var dateEnd=0, timesEnd, dateStart=0, timesStart;
	    if (time){
	    	var times = time.split('-');
	    	var today =  new Date();
			dateStart = timeToDate(times[0], now);
			dateEnd = timeToDate(times[1], today);
	    	timesEnd = Date.parse(dateEnd);
	    	timesStart = Date.parse(dateStart);
		}
		else {
			timesEnd = curTime;
			timesStart = curTime-1;
		}
        if(curTime<=timesEnd && curTime>timesStart){
           return true;
        }
		return false;
	}
	/**
	* Устанавливает русский язык
	*/
	function setRuLang(){
		$("#service").html("Ваш номер:");
		$("#service1").html("Услуга:");
		$('#langselect').html("Выбор языка");
		$('#footer').html("Медицинская информационная система «НАДЕЖДА», разработчик ИП «PROFit»");
		$('#labelTime').html("Время:");
		$('#weightYourNumber').html("Ожидайте вызова вашего номера на табло");
		$('#return').html("Вернуться на главную через:");
		$('#recordOnline').html("Выберите услугу");
		$('.appoint').html("Запись к участковому врачу");
		$('#clinic').html("Медицинская информационная система «НАДЕЖДА», разработчик ИП «PROFit»");
		$('#back').html("Назад");
	}
	/**
	* Устанавливает казахский язык
	*/
	function setKzLang(){
		$('#langselect').html("Тілді таңдау:");
		$("#service1").html("Услуга:");
		$('#footer').html("&laquoНАДЕЖДА&raquo медициналық ақпараттық жүйесі, әзірлеуші &laquoPROFit&raquo ЖК");
		$("#service").html("Сіздің нөміріңіз:");
		$('#labelTime').html("Уақыты:");
		$('#weightYourNumber').html("Ожидайте вызова вашего номера на табло");
		$('#return').html("Вернуться на главную через:");
		$('#recordOnline').html("Выберите услугу");
		$('.appoint').html("Учаскелік дәрігерге жазылу");
		$('#clinic').html("&laquoНАДЕЖДА&raquo медициналық ақпараттық жүйесі, әзірлеуші &laquoPROFit&raquo ЖК");
		$('#back').html("Артқа");
	}
	/**
	* Устанавливает язык на странице
	*
	*/
	function setLang(lang){
		if(lang) {
			switch(lang){
				case "1":
				$("#ru").addClass("active");
				setRuLang();
				break;
				case "2":
				$("#kz").addClass("active");
				setKzLang();
				break;
				default:
				$("#ru").addClass("active");
				setRuLang();
			}
		}
	}
	/**
	* Отправляет на печать страницу
	* @param
	* @return
	*/
	function printit(){ 
		if (window.print) {
			window.print() ; 
		} 
		else {
			var WebBrowser = '<OBJECT ID="WebBrowser1" WIDTH=0 HEIGHT=0 CLASSID="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"></OBJECT>';
			document.body.insertAdjacentHTML('beforeEnd', WebBrowser);
			WebBrowser1.ExecWB(6, 1);//Use a 1 vs. a 2 for a prompting dialog box WebBrowser1.outerHTML = ""; 
		}
	}
	/**
	* счетчик секундного обратного отчета
	* @param 
	* @return 
	*/
	function timer(){
		var obj=document.getElementById('timer_inp');
		obj.innerHTML--;
		    if (obj.innerHTML==0){
				location.reload();
		        setTimeout(function(){},1500);
		    } else {
		        setTimeout(timer,1500);
		    }
	}
	/**
	* Читает текст из файла
	*/
	function readFile(object) {
		var file = object.files[0];
		var reader = new FileReader();
		reader.onload = function() {
			document.getElementById('out').innerHTML = reader.result;
		}
		reader.readAsText(file);
	}
	/**
	* Возвращает номер(ID) терминала из параметра в URL
	* @return int
	*/
	function getPoint(){
		var	point = getUrlVar();
		if(point){
			return point.point;
		}
		else{
			return false;
		}
	}
	/**
	* Возвращает метку языка
	* @return int
	*/
	function getLang(){
		var lang = getUrlVar();
		if(lang){
			return lang.lang;
		}
		else {
			return lang="1"; //по умолчанию русский
		}
	}
	/**
	* Возвращает массив с параметрами GET из URL
	* @return array
	*/
	function getUrlVar(){
	    var urlVar = window.location.search; // получаем параметры из урла
	    var arrayVar = []; // массив для хранения переменных
	    var valueAndKey = []; // массив для временного хранения значения и имени переменной
	    var resultArray = []; // массив для хранения переменных
	    arrayVar = (urlVar.substr(1)).split('&'); // разбираем урл на параметры
	    if(arrayVar[0]=="") return false; // если нет переменных в урле
	    for (i = 0; i < arrayVar.length; i ++) { // перебираем все переменные из урла
	        valueAndKey = arrayVar[i].split('='); // пишем в массив имя переменной и ее значение
	        resultArray[valueAndKey[0]] = valueAndKey[1]; // пишем в итоговый массив имя переменной и ее значение
	    }
	    return resultArray; // возвращаем результат
	}
	/**
	* Функция обработки ошибок
	* @param json
	* @return bool 
	*/
	function GetError(error) {
		// очищаем блок с ошибкой
		$('#ernote').remove();
		// вносим текст ошибки
		$('#error').append('<span id="ernote">'+error+'</span>');
		// показываем блок с ошибкой
		$('#error').fadeIn(700);
		setTimeout(timer,100);
	}
	$.ajaxSetup({ // параметры ajax-запроса по умолчанию 
		url: server+'qsystem/command',
		type: 'POST',
		dataType: 'json',
		  beforeSend: function() {
		    $('.loader').show();
		  },
		  complete: function() {
		    $('.loader').hide();
		  },
		  error: function(jqXHR, textStatus, errorThrown) {
		  //  console.log('Ошибка: ' + textStatus + ' | ' + errorThrown);
			$('.loader').hide();
			GetError('Ошибка: '+errorThrown);
		  }
	});
	//функции при успешном ajax-запросе
	actions = {
		SList: function (response) {//получение списка услуг
			var rootServices = response.result.root.inner_services;//массив с корневыми услугами
			console.log(response);
			renderServices(rootServices);
		},
		SetQueue: function (response){//Устанавливает в очередь выбранную услугу
			var talon = response.result;
			talonRender(talon);
		},
		CallNextClient: function(response){
			console.log(response);
		}
	};
	function renderCounts(){
		var sel = $(".qservice").find("a");
		for (var i = 0; i < sel.length; i++) {
			getInQueue(sel[i].dataset.id);
		}
	}
	/**
	* Удаляем пустые значения массива
	*/
	function cleanArray(actual) {
	  var newArray =[];
	  for (var i = 0; i < actual.length; i++) {
		if (actual[i]) {
		  newArray.push(actual[i]);
		}
	  }
	  return newArray;
	}
	/**
	* Смотрит какое время использовать основное или альтернативное
	* в случае использования альтернативного времени смотрится в какой день его использовать
	* 0-6 от Воскресенья до субботы, Д|дата
	*/
	function getTimes(altTime, mainTime, serviceID){
		if(altTime){
			let now = new Date();
			let today = now.getDay();
			var altDayArr = altTime.split('|'), altDay = altDayArr[0], onlyAltTime = altDayArr[1];
			if(altDay == today){
				return onlyAltTime;
			}
			else {
				return mainTime;
			}
		}
		else {
			return mainTime;
		}
	} 
	/**
	* Отрисовывает список услуг в DOM
	* переменная point это ID терминала на котором настроенны определенные услуги
	* @param array
	*/
	function renderServices (services){
		var point = getPoint();
		var lang = getLang();
		var listServices = $("#Qservices");
		var serviceName="";
		var arr = [];
			var sel = getInQueue();
		if(point){
			for (var i = 0; i < services.length; i++) {
				if(services[i].status){
					if (point==services[i].point) {
						serviceName = getServiceName(services[i].langs, lang);
						var times = getTimes(services[i].tablo_text, services[i].ticket_text, services[i].id);
						var allow = compareTimes(times);
						var limit = limitPerDay(services[i].id,services[i].day_limit);
						if(allow){
							if(limit){
								if(services[i].inner_services.length){//если есть вложенные услуги 
									$('<div>', {
										addClass: ('qservice'),
										html: '<a id="SubQueue" data-id="'+services[i].id+'" data-time="'+times+'">'+serviceName+'</a>',
									}).appendTo(listServices);
									arr[i] = {id:services[i].id,inserv:services[i].inner_services};
								}
								else {
									for (var j = 0; j < sel.result.length; j++) {
										if(sel.result[j].id == services[i].id){
												$('<div>', {
												addClass: ('qservice'),
												html: '<span><a id="SetQueue" data-id="'+services[i].id+'" data-time="'+times+'"><span id="serviceName">'+serviceName+'</span></a><div id="inQueue">В очереди: <span style="color:orange">'+sel.result[j].waiting+'</span></div>',
											}).appendTo(listServices);
										}
									}
								}
							}
						}//allow
					}
				}
			}
		}
		
		
		else {
			for (var i = 0; i < services.length; i++) {
				if(services[i].status){
					serviceName = getServiceName(services[i].langs, lang);
					var times = getTimes(services[i].tablo_text, services[i].ticket_text, services[i].id);
					var allow = compareTimes(times);
					var limit = limitPerDay(services[i].id,services[i].day_limit);
					if(allow){
						if(limit){
							if(services[i].inner_services.length>0){//если есть вложенные услуги
								$('<div>', {
									addClass: ('qservice'),
									html: '<span><a id="SubQueue" data-id="'+services[i].id+'" data-time="'+times+'">'+serviceName+'</a></span>',
								}).appendTo(listServices);
								arr[i] = {id:services[i].id,inserv:services[i].inner_services};
								//sessionStorage.setItem('innerServices',JSON.stringify(services[i].inner_services));
							}
							else {
								for (var j = 0; j < sel.result.length; j++) {
									if(sel.result[j].id == services[i].id){
											$('<div>', {
											addClass: ('qservice'),
											html: '<span><a id="SetQueue" data-id="'+services[i].id+'" data-time="'+times+'"><span id="serviceName">'+serviceName+'</span></a><div id="inQueue">В очереди: <span style="color:orange">'+sel.result[j].waiting+'</span></div>',
										}).appendTo(listServices);
									}
								}
							}
						}
					}	
				}
			}
		}
		if(arr.length>0){
			sessionStorage.setItem('innerServices',JSON.stringify(arr));
		}
	}
	/**
	* Обработка клика по услуге у которой есть вложенные услуги
	*/
	$(document).on("click","#SubQueue[data-id]",function(e){
		var lang = getLang();
		if (lang=="1") {
			var back = "Назад";
		}
		else if(lang=="2"){
			var back = "Артқа";
		}
		else {
			var back = "Назад";
		}
		var service_id = this.dataset.id
		var inner_services = JSON.parse(sessionStorage['innerServices']);
		
		for(let i=0; i<inner_services.length; i++){
			if(inner_services[i]){
				if(inner_services[i].id == service_id){
					var services = inner_services[i].inserv
					break;		
				}
			}	
		}
		var name = this.innerHTML;
		$("#Qservices").find(".qservice").remove();
		$("#recordOnline").html(name);
		renderServices(services);
		$("#Qservices").append('<div class="qservice"><span><a id="back">'+back+'</a></span></div>');
		setTimeout(timer,20000);
	});
	/**
	* Обработка клика по кнопке "Вернутся"
	*/
	$(document).on("click","#back",function(e){
		var lang = getLang();
		var point = getPoint();
		if(lang && !point){
			history.pushState({}, 'title', '/qsystem.html?lang='+lang);
		}
		else if(point && !lang) {
			history.pushState({}, 'title', '/qsystem.html?point='+point);
		}
		else if(lang && point){
			history.pushState({}, 'title', '/qsystem.html?point='+point+'&lang='+lang);
		}
		else{
			history.pushState({}, 'title', '/qsystem.html');
		}
		
		location.reload();
	});
	/**
	* Возвращает имя сервиса в зависимости от установленной языковой переменной
	* 1- русский, 2-казахский
	* @param array, int
	* @return string
	*/
	function getServiceName(langs, lang){
		switch(lang){
			case "1":
				for (var i = 0; i < langs.length; i++) {
					if(langs[i].lang=="ru_RU"){
						return langs[i].name;
						break;
					}
				}
			break;
			case "2":
				for (var i = 0; i < langs.length; i++) {
					if(langs[i].lang=="kz_KZ"){
						return langs[i].name;
					}
				}
			break;
			default:
				for (var i = 0; i < langs.length; i++) {
					if(langs[i].lang=="ru_RU"){
						return langs[i].name;
						break;
					}
					
				}
		}
	}
	/**
	* получает счетчик талонов из LocalStorage и увеличивает его на единицу
	*/
	function incrementCount(serviceID) {
		if (localStorage.getItem(serviceID) !== null) {
		  let incAlready = new Promise ((resolve, reject)=>{
			  var currentCount = localStorage.getItem(serviceID);
			  currentCount++;
			  resolve(currentCount);
			}).then((newCount)=>{
				localStorage.setItem(serviceID, newCount)
			}).catch((err)=>{
				console.log(err);
			});
		}
		else {
			localStorage.setItem(serviceID, 1);
		}
	}
	/**
	* Рендерит талон и отправляет его на печать
	*/
	function talonRender(talon){
		if(talon){
			console.log(talon);
			var lang = getLang();
			var service_name = getServiceName(talon.to_service.langs, lang);
			var talonCont = $(".talon");
			$('#success').remove();//очистим текст
			$('.service').html(service_name);
			$('#prefix').html(talon.prefix);
			$('#number').html(talon.number);
			$('#dateTime').html(talon.stand_time);
			if(talon.to_service.tablo_text){
				$("#talonText").html(talon.to_service.tablo_text);
			}
			$('#success').html("Возьмите ваш талон");
			$('#recordOnline').hide();
			$('#clinic').hide();
			$('.lang').hide();
			$('.lang').hide();
			$('#Qservices').hide();
			$('#mainform').fadeIn(700);
			incrementCount(talon.to_service.id);//счетчик выданных талонов
			setTimeout(printit, 1000)//печать талона
			/*setTimeout(printJS({printable:'talon',
                            type:'html',
                            maxWidth:460,
                            style:'#number,#prefix {font-size:84px;}#talon {text-align:center;}#terminalDate{font-size:18px;margin-bottom:10px;}#spaceing {padding: 10px;}',
                            ignoreElements:['timeCounter'],
                        }), 1000);*/
			//setTimeout(timer,1000);//перезагрузка на главную
		}
		else {
			return false;
		} 
	}
	/**
	* Универсальная функция обработки ajax асинхронного запроса
	*/
	function ajaxRequest(data, responseHandler) {
		$.ajax({
			data: data,
			success: actions[responseHandler]
		});
	}
	/**
	* Загружает список всех услуг
	*/
	function SListRequest (){
		var data = JSON.stringify({"method":"Получить перечень услуг"});
		ajaxRequest(data,'SList');
	}
	/**
	* Возвращает количество клиентов в очереди
	*/
	function getInQueue(){
		var data = JSON.stringify({"method":"Получить состояние сервера"});
		 $.ajax({
		    async: false,
		    url: server + 'qsystem/command',
		    data:data,
		    success: function(result) {
		         succeed = result;
		    }});
    	return succeed;
	}
	/**
	* Ставит в очередь
	*/
	function SetInQueue (service_id){
		var data = JSON.stringify({"params":{"service_id":service_id,"pass":"1","priority":1,"lng":"ru_RU"},"method":"Поставить в очередь"});
		ajaxRequest(data,'SetQueue');
	}
	/**
	 * Вызывает следующего в очереди
	 */
	function CallNext(){
		var data = JSON.stringify({"params":{"user_id":14},"method":"Получить следующего клиента"});
		ajaxRequest(data,'CallNextClient');
	}
	/**
	* Отправляет статус на сервис мониторинга
	* 
	*/
	function jsonpQuery(pm_url,hostID){
		$.ajax({
			   type: "GET",
			   dataType: "jsonp",
			   url: pm_url,
			   crossDomain: true,
			   data: {status: "ok", hostID: hostID},
			   success: function(response) {
			   	console.log(response);
			    },
			    error: function(xhr, status, error) {
			        console.log(status + '; ' + error);
			    }
    	});
	}
	/**
	* ограничение выданных талонов в день
	*/
	function limitPerDay(serviceID, limit){
		if (localStorage.getItem(serviceID) !== null) {
			var perDay = localStorage.getItem(serviceID);
			if(limit > 0){
				if(perDay < limit) {
					return true;
				}
				else {
					return false;
				}
			}
			else {
				return true;
			}
		}
		return true;
	}
	/**
	* Действия по умолчанию при загрузки страницы
	*/
	$(document).ready(function(){
		//let promiseDate = new Promise 
		var uri = getUrlVar();
		var point = uri.point, lang = uri.lang, Flur = uri.toFlur, hostID = uri.hostID;
		/*
		if(point && hostID){
			$("#Qservices").append('<div class="qservice"><span><a href="https://lkp-sko.dmed.kz/ScheduleRecord/NotAuthRecord" id="SetQueue" class="appoint">Запись к участковому врачу</a></span></div>');
		}
		else if (point){
			$("#Qservices").append('<div class="qservice"><span><a href="https://lkp-sko.dmed.kz/ScheduleRecord/NotAuthRecord" class="appoint">Запись к участковому врачу</a></span></div>');
		}
		else if (hostID){
			$("#Qservices").append('<div class="qservice"><span><a href="https://lkp-sko.dmed.kz/ScheduleRecord/NotAuthRecord" id="SetQueue" class="appoint">Запись к участковому врачу</a></span></div>');
		}
		else {
			$("#Qservices").append('<div class="qservice"><a href="https://lkp-sko.dmed.kz/ScheduleRecord/NotAuthRecord" id="SetQueue" class="appoint"><span>Запись к участковому врачу</span></a></div>');
		}*/
		refreshLocalStorage();
		SListRequest ();
		setLang (lang);
		sessionStorage.clear();
		$("#recordOnline").html("Выберите услугу");
		if(hostID){
			setInterval(function() {
				jsonpQuery('http://tstatus.e-health.kz/ajax/setStatus.php', hostID);
			}, 10000); //каждые 10 секунд			
		}
		refreshAt(7,31,0);
		startBreak(5000);//перерыв на обед
	});
	/**
	* Обработка действия по клику на сервис
	*/
	$(document).on("click","#SetQueue[data-id]",function(e){
		var service_id = this.dataset.id, time = this.dataset.time;
		var limit = Number(this.dataset.limit);
		var count = Number(this.dataset.count);
		var allow = compareTimes(time);
		if(allow){
			if(limitPerDay(count, limit)){
				SetInQueue(service_id);
			}
			else {
				GetError("Превышен лимит талонов в день");
			}
		}
		else {
			GetError("Выдача талонов только до "+time);
		}
	});
	/**
	* Обработка действия по клику на переключатель языка(ru)
	*/
	$("#ru").click(function(){
		var uri = getUrlVar();
		var point = uri.point, hostID = uri.hostID;
		if (point && hostID) {
			if (history.pushState) {
		        var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
		        var newUrl = baseUrl + '?point='+point+'&lang=1'+'&hostID='+hostID;
		        history.pushState(null, null, newUrl);
    		}
		}
		else if (point) {
			var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
			var newUrl = baseUrl + '?point='+point+'&lang=1';
			history.pushState(null, null, newUrl);
		}
		else if (hostID){
			var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
			var newUrl = baseUrl + '?lang=1'+'&hostID='+hostID;
			history.pushState(null, null, newUrl);
		}
		else {
			if (history.pushState) {
		        var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
		        var newUrl = baseUrl + '?lang=1';
		        history.pushState(null, null, newUrl);
    		}
		}
		location.reload();	
	});
	/**
	* Обработка действия по клику на переключатель языка(kz)
	*/
	$("#kz").click(function(){
		var uri = getUrlVar();
		var point = uri.point, hostID = uri.hostID;
		if (point && hostID) {
			if (history.pushState) {
		        var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
		        var newUrl = baseUrl + '?point='+point+'&lang=2'+'&hostID='+hostID;
		        history.pushState(null, null, newUrl);
    		}
		}
		else if (point) {
			var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
			var newUrl = baseUrl + '?point='+point+'&lang=2';
			history.pushState(null, null, newUrl);
		}
		else if (hostID){
			var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
			var newUrl = baseUrl + '?lang=2'+'&hostID='+hostID;
			history.pushState(null, null, newUrl);
		}
		else {
			if (history.pushState) {
		        var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
		        var newUrl = baseUrl + '?lang=2';
		        history.pushState(null, null, newUrl);
    		}
		}
		location.reload();	
	});
	$("#return").click(function(){
		location.reload();
	});
	$("#CallUser").click(function(){
		CallNext();
	});
	$("body").on("contextmenu", false);//заблокировать контекстное меню
	document.body.style.cursor = 'none'; 
	/**
	* Устанавливает перерыв на обед
	*/
	function setBreakInterface(){
		var now = new Date();
		var time = now.getTime();
		var then = new Date();
		var thenEnd = new Date();
		var startBreak = then.setHours(12, 55, 0, 0);
		var endBreak  = thenEnd.setHours(13, 55, 0, 0);
	    if (now > startBreak && now < endBreak) {
	    	$("#blocker").show();
	    }
	    else {
	    	$("#blocker").hide();
	    }
	}
	/**
	* Устанавливает с какой переодичностью проверять есть ли перерыв
	*/
	function startBreak(time) {
		setInterval(setBreakInterface, time);
	}
	$("#breakfast").click(function () {
		location.reload();
	});

});