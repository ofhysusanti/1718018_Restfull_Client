const baseUrl = "http://localhost/REST_Server_Perpustakaan/";
const bukuEndPoint = `${baseUrl}buku`;

const contents = $("#content-list");
const tbody = $("#tbody");
const title = $("#pageTitle");
var tabel = $('#tabelBuku').DataTable();

function getAllBuku() {
    tabel.clear().draw();
    title.innerHTML = "Data Buku";
    let printToHtml = [];

    fetch(bukuEndPoint)
        .then(response => response.json())
        .then(resJson => {
            resJson.data.forEach(data => {
                btnOpsi = `<button onclick="getBuku(${data.id})" class="btn btn-sm btn-light">
                                <i class="material-icons">create</i>
                            </button>
                            <button onclick="deleteBuku(${data.id})" class="btn btn-sm btn-outline-danger">
                                <i class="material-icons">delete</i>
                            </button>`;
                printToHtml.push([data.id, data.judul, data.pengarang, data.tahun_terbit, data.penerbit,btnOpsi]);
            });
            tabel.rows.add(printToHtml);
            tabel.draw();
        }).catch(err => {
            console.error(err);
        });
}

function saveData() {
    let methodUsed = 'POST';
    let id = $('#idInput').val();
    if (id.length > 0) methodUsed = 'PUT';

    fetch(bukuEndPoint, { 
            method: methodUsed,
            body: new URLSearchParams({
                    "id": id,
                    "judul": $('#judulInput').val(),
                    "pengarang": $('#pengarangInput').val(),
                    "tahun_terbit": $('#tahun_terbitInput').val(),
                    "penerbit": $('#penerbitInput').val()
                }),
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded'
            } 
        })
        .then(response => response.json())
        .then(resJson => {
            if(resJson.status) {
                makeAlert('success', resJson.msg);;
                cancelForm();
            } else {
                makeAlert('danger', resJson.msg);
            }

        }).catch(err => {
            console.error(err);
        })
}

function getBuku(id) {
    fetch(bukuEndPoint+'?id='+id)
        .then(response => response.json())
        .then(resJson => {
            if(resJson.status) {
                resJson.data.forEach(data => {
                    $('#idInput').val(data.id);
                    $('#judulInput').val(data.judul);
                    $('#pengarangInput').val(data.pengarang);
                    $('#penerbitInput').val(data.penerbit);
                    $('#tahun_terbitInput').val(data.tahun_terbit);
                });
                console.log(resJson);
                showForm();
                title.innerHTML = "Edit Data Buku";

            } else {
                makeAlert('danger', resJson.msg);
            }
        }).catch(err => {
            console.error(err);
        })
}

function deleteBuku(id) {
    fetch(bukuEndPoint, { 
        method: 'DELETE',
        body: new URLSearchParams({
                "id": id,
            }),
        headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
        } 
    })
    .then(response => response.json())
    .then(resJson => {
        if(resJson.status) {
            makeAlert('success', resJson.msg);;
            refreshTable();

        } else {
            makeAlert('danger', resJson.msg);
        }

    }).catch(err => {
        console.error(err);
    })
}

function hideForm() {
    title.innerHTML = "Daftar Buku";
    $('#formBukuContainer').hide();
    $('#btnTambah').show();
    $('#tabelBukuContainer').show();
    $('#idInput').value = '';
    getAllBuku();
}

function showForm() {
    title.innerHTML = "Tambah Data Buku";
    $('#formBukuContainer').show();
    $('#btnTambah').hide();
    $('#tabelBukuContainer').hide();
}

function cancelForm() {
    title.innerHTML = "Daftar Buku";
    $('#formBuku')[0].reset();
    $('#idInput').value = '';
    hideForm();
}

function refreshTable() {
    tabel.clear().draw();
    getAllBuku();
}

function makeAlert(alertType, alertText) {
    alertContainer.innerHTML = `<div class="alert alert-${alertType} col-12" role="alert">
                                    ${alertText}
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>`;
}

$(document).ready(function() {
    cancelForm();
} );