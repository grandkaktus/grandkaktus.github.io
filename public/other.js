"use strict";

function init(get) {
	$.ajax({
		type: "GET",
		url: "https://progect-one.herokuapp.com/invoices" +get,
		dataType: 'json',
		error: function(){
			alert('error');
		},
		success: function(data){
			order_out (data);
		}
	});
}	

function order_out (data) {	
	let out = '';
	let i = 0;
	$(data).each(function() {
		let id = '';
		out += '<tr class="tr">';
		$.each(data[i], function(key, val) {
	//		console.log( 'Индекс: ' + key + '; Значение: ' + val );	
			if (key == 'id') {
				id = val;
			}
			out += '<td>' +val+ '</td>';
		});	
//		out += '<td> <input type="button" value="X" title="Удалить" onclick="delet(\''+id+'\')"> </td>';
		out += '<td> <input type="button" value="X" title="Удалить" data-id="'+id+'"> </td>';
		out += '<td> <input type="button" value="R" title="Редактировать" onclick="edit(\''+id+'\')"> </td>';
		out += '</tr>'
		i++;
	});
	
	$(out).appendTo('table#table');
	$('input[data-id]').on('click', delet);	
}

// удаление записи
function delet() {
	let id = $(this).attr('data-id');
	if (confirm('Удалить строку № '+id+'?') ) {
		$(this).closest('tr.tr').remove();
		$.ajax({
			type: 'DELETE',
			url: "https://progect-one.herokuapp.com/invoices/"+id,
			dataType: 'json',
			error: function(){
				alert('error');
			},
			success: function(){
				
			}
		});
	}
}	
// изменение записи
function edit(key) {
	if (confirm('Редактировать строку № '+key+'?') ) {
		window.open("/public/add_order.html?"+key ,"_self")
	}
}	

// Добавление новой строки
function edit_db (query) {
	let f = document.forms.form;
	let dop = (query == 'patch') ? '/'+f.id.value : ''
	$.ajax({
		type: query,
		url: "https://progect-one.herokuapp.com/invoices"+dop,
		dataType: 'json',
		data: { 
			id: f.id.value,
			direction: f.direction.value,
			number: f.number.value,
			date_created: f.date_created.value,
			date_due: f.date_due.value,
			date_supply: f.date_supply.value,
			comment: f.comment.value
		 },
		error: function(){
			alert('error');
		},
		success: function(){
			alert('success');
		}
   });
}

// Сортировки и поиск
function search_sort() {
	let f = document.forms.under_table;
	let search_input = f.search.value;	
	let select_search = f.select_search.value;	
	let select_sort_item = f.select_sort_item.value;	
	let select_sort = f.select_sort.value;
	let get = '?';

	if (select_sort != 'none') {
		get += '_sort='+ select_sort_item +'&_order='+select_sort;
	}
	if (search_input != '') {
		if (select_sort != 'none') { 
			get += '&';
		}
		if (select_search == 'all') {
			get += 'q='+search_input;
		}
		else {
			get += select_search +'='+ search_input;
		}
	}
	$('table#table tr.tr').remove();
	init(get);
}

// Сброс Сортировки и поиска
function no_search_sort() {
	$('table#table tr.tr').remove();
	init('');
}	

// Исполняется после загрузки стр
$(document).ready(function(){
	let url = window.location.href;
	if (url.search('add_order.html') >= 0) {
		if (url.search('\\?') >= 0) {
			let id = url.split('?');
	
			$.ajax({
				type: "GET",
				url: "https://progect-one.herokuapp.com/invoices?id="+id[1],
				dataType: 'json',
				error: function(){
					alert('error');
				},
				success: function(data){
					let f = document.forms.form;
					f.id.value = data[0]['id'];
					f.direction.value = data[0]['direction'];
					f.number.value = data[0]['number'];
					f.date_created.value = data[0]['date_created'];
					f.date_due.value = data[0]['date_due'];
					f.date_supply.value = data[0]['date_supply'];
					f.comment.value = data[0]['comment'];
				
					$('input[type=button]').on('click', function () {
						edit_db('patch');
					});				
				}
		   });
		}
		else {
			$('input[type=button]').on('click', function () {
				edit_db('post');
			});				
		}
	}
	else {
		init('');
	}
});
