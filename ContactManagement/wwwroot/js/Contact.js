const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phonePattern = /^(?:\+91|91)?(?:\d{10}|\d{2,5}-\d{6,8})$/;
$(document).ready(function () {
    $('#ContactModalCenter').modal({
        backdrop: 'static',
        keyboard: false
    })
    $('#viewContactModalCenter').modal({
        backdrop: 'static',
        keyboard: false
    })
    GetContactList();

    $('#inputEmailAddress').on('input', function () {
        const email = $(this).val();
        if (emailPattern.test(email)) {
            $('#validationMessage').text('');
        } else {;
            $('#validationMessage').text('Invalid email address').css('color', 'red');
        }
    });
    $('#inputConfirmPassword').on('input', function () {
        const ConfirmPassword = $(this).val();
        if ($("#inputPassword").val() == ConfirmPassword) {
            $('#validationMessagepassword').text('');
        } else {
            $('#validationMessagepassword').text('Passwords do not match').css('color', 'red');
        }
    });
    $('#inputPhoneNo').on('input', function () {
        const phone = $(this).val();
        if (phonePattern.test(phone)) {
            $('#validationMessagePhoneNo').text('');
        } else {
            $('#validationMessagePhoneNo').text('Invalid phone number').css('color', 'red');
        }
    });
})
$("#addNewContact").click(function () {
    $("#ContactModalCenter").modal("show");
});
$("[data-dismiss='modal']").click(function () {
    $("#ContactModalCenter").modal("hide");
    $(".form-group > input").val("");
    $("#inputId").val(0);
    $("#viewContactModalCenter").modal("hide");
    $("#lblFirstName").text("");
    $("#lblLastName").text("");
    $("#lblEmailAddress").text("");
    $("#lblUserName").text("");
    $("#lblPassword").text("");
    $("#lblConfirmPassword").text("");
    $("#lblPhoneNo").text("");
    $("#lblAddress").text("");
});
$("#saveContact").click(function () {

    if ($("#inputFirstName").val() == '') {
        Swal.fire({
            text: "Please Enter First Name",
            icon: "warning"
        }).then(function () {
            $("#inputFirstName").focus()
        });
        return $("#inputFirstName").focus();
    }
    if ($("#inputLastName").val() == '') {
        Swal.fire({
            text: "Please Enter Last Name",
            icon: "warning"
        }).then(function () {
            $("#inputLastName").focus()
        });
        return false;
    }
    if ($("#inputEmailAddress").val() == '') {
        Swal.fire({
            text: "Please Enter Email Id",
            icon: "warning"
        }).then(function () {
            $("#inputEmailAddress").focus()
        });
        return false;
    }
    else
    {
        if (emailPattern.test($("#inputEmailAddress").val())) {
        } else {
            Swal.fire({
                text: "Invalid email address",
                icon: "warning"
            }).then(function () {
                $("#inputEmailAddress").focus()
            });
            return false;
        };
    }
    if ($("#inputUserName").val() == '') {
        Swal.fire({
            text: "Please Enter Username",
            icon: "warning"
        }).then(function () {
            $("#inputUserName").focus()
        });
        return false;
    }
    if ($("#inputPassword").val() == '') {
        Swal.fire({
            text: "Please Enter Password",
            icon: "warning"
        }).then(function () {
            $("#inputPassword").focus()
        });
        return false;
    }
    if ($("#inputConfirmPassword").val() == '') {
        Swal.fire({
            text: "Please Enter Confirm Password",
            icon: "warning"
        }).then(function () {
            $("#inputConfirmPassword").focus()
        });
        return false;
    }
    if ($("#inputPassword").val() != $("#inputConfirmPassword").val()) {
        Swal.fire({
            text: "Passwords do not match",
            icon: "warning"
        }).then(function () {
            $("#inputConfirmPassword").focus()
        });
        return false;
    }
    if ($("#inputPhoneNo").val() == '') {
        Swal.fire({
            text: "Please Enter Phone Number",
            icon: "warning"
        }).then(function () {
            $("#inputPhoneNo").focus()
        });
        return false;
    } else {
        if (phonePattern.test($("#inputPhoneNo").val())) {
        } else {
            Swal.fire({
                text: "Invalid phone number",
                icon: "warning"
            }).then(function () {
                $("#inputPhoneNo").focus()
            });
            return false;
        }
    }
    if ($("#inputAddress").val() == '') {
        Swal.fire({
            text: "Please Enter Address",
            icon: "warning"
        }).then(function () {
            $("#inputAddress").focus()
        });
        return false;
    }

    var formData = new FormData($('#contactForm')[0]);

    $.ajax({
        url: siteUrl + 'Home/SaveUpdateContact',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.success == true) {
                Swal.fire({
                    title: response.message + "!",
                    text: "Contact has been " + response.message + ".",
                    icon: "success"
                }).then((result) => {
                    $("#ContactModalCenter").modal("hide");
                    $(".form-group > input").val("");
                    $("#inputId").val(0);
                    GetContactList();
                });;
            } else {
                if (response.message != null) {
                    if (response.status == 1) {
                        Swal.fire({
                            text: response.message,
                            icon: "warning"
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: response.message,
                            icon: "error"
                        });
                    }
                }
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                title: "Error!",
                text: error,
                icon: "error"
            });
        }
    });
});
function EditContact(Id) {
    $.ajax({
        url: siteUrl + 'Home/GetSingleContact?Id=' + Id,
        type: 'POST',
        success: function (response) {
            debugger;
            $("#inputId").val(Id);
            $("#inputFirstName").val(response.firstname);
            $("#inputLastName").val(response.lastname);
            $("#inputEmailAddress").val(response.email);
            $("#inputUserName").val(response.username);
            $("#inputPassword").val(response.password);
            $("#inputConfirmPassword").val(response.confirmpassword);
            $("#inputPhoneNo").val(response.phoneno);
            $("#inputAddress").val(response.address);
            $("#ContactModalCenter").modal("show");
        },
        error: function (xhr, status, error) {
            Swal.fire({
                title: "Error!",
                text: error,
                icon: "error"
            });
        }
    });
}
function DeleteContact(id) {
    $.ajax({
        url: siteUrl + 'Home/DeleteContact?ID=' + id,
        type: 'POST',
        success: function (response) {
            if (response.success == true) {
                Swal.fire({
                    title: "Deleted!",
                    text: "Contact has been Deleted.",
                    icon: "success"
                }).then((result) => {
                    GetContactList();
                });;
            } else {
                if (response.message != null) {
                    if (response.status == 1) {
                        Swal.fire({
                            title: "Error!",
                            text: response.message,
                            icon: "warning"
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: response.message,
                            icon: "error"
                        });
                    }
                }
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                title: "Error!",
                text: error,
                icon: "error"
            });
        }
    });
}
function ViewContact(Id) {
    $.ajax({
        url: siteUrl + 'Home/GetSingleContact?Id=' + Id,
        type: 'POST',
        success: function (response) {
            $("#lblFirstName").text(response.firstname);
            $("#lblLastName").text(response.lastname);
            $("#lblEmailAddress").text(response.email);
            $("#lblUserName").text(response.username);
            $("#lblPassword").text(response.password);
            $("#lblConfirmPassword").text(response.confirmpassword);
            $("#lblPhoneNo").text(response.phoneno);
            $("#lblAddress").text(response.address);
            $("#viewContactModalCenter").modal("show");
        },
        error: function (xhr, status, error) {
            Swal.fire({
                title: "Error!",
                text: error,
                icon: "error"
            });
        }
    });
}
function GetContactList() {
    var searchInputEmail = $("#searchInputEmail").val();
    $.ajax({
        url: siteUrl + 'Home/GetContactList?searchEmail=' + searchInputEmail,
        type: 'POST',
        success: function (response) {
            BindContactList(response)
        },
        error: function (xhr, status, error) {
            Swal.fire({
                title: "Error!",
                text: error,
                icon: "error"
            });
        }
    });
}

function BindContactList(data) {
    var conListHtml = '';
    var FavListHtml = '';

    $("#ContactListDiv").html('');
    $("#favContactListDiv").html('');
    if (data != null && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            conListHtml += '<div class="list-group-item list-group-item-action flex-column align-items-start">';
            conListHtml += '<div class="row">';
            conListHtml += '<div class="col-sm-1 text-center">';
            conListHtml += '<span style="font-size: 1.2em;"><a onclick="EditContact(' + data[i].id + ')" class="text-info"><i class="bi bi-pencil-square"></i></a></span>';
            conListHtml += '<span style="font-size: 1.2em;"><a onclick="DeleteContact(' + data[i].id + ')" class="text-danger"><i class="bi bi-x-circle"></i></a></span>';
            conListHtml += '</div>';
            conListHtml += '<div class="col-sm-9" onclick="ViewContact(' + data[i].id + ')">';
            conListHtml += '<div class="d-flex w-100 justify-content-between">';
            conListHtml += '<h5 class="mb-1">' + data[i].firstname + ' ' + data[i].lastname + '</h5>';
            conListHtml += '</div>';
            conListHtml += '<small>' + data[i].email + '</small>';
            conListHtml += '</div>';
            conListHtml += '<div class="col-sm-2 text-center">';
            if (data[i].isfavorate == 1) {
                conListHtml += '<span style="font-size: 1.5em;"><a class="text-warning" onclick="SetFavorateContact(' + data[i].id + ', 0)"><i class="bi bi-star-fill"></i></a></span>';
            } else {
                conListHtml += '<span style="font-size: 1.5em;"><a class="text-warning" onclick="SetFavorateContact(' + data[i].id + ', 1)"><i class="bi bi-star"></i></a></span>';
            }
            conListHtml += '</div>';
            conListHtml += '</div>';
            conListHtml += '</div>';

            if (data[i].isfavorate == 1) {

                FavListHtml += '<div class="list-group-item list-group-item-action flex-column align-items-start">';
                FavListHtml += '<div class="row">';
                FavListHtml += '<div class="col-sm-10">';
                FavListHtml += '<div class="d-flex w-100 justify-content-between">';
                FavListHtml += '<h5 class="mb-1">' + data[i].firstname + ' ' + data[i].lastname + '</h5>';
                FavListHtml += '</div>';
                FavListHtml += '<small>' + data[i].email + '</small>';
                FavListHtml += '</div>';
                FavListHtml += '<div class="col-sm-2 text-center">';
                FavListHtml += '<span style="font-size: 1.5em;"><a class="text-danger" onclick="SetFavorateContact(' + data[i].id + ', 0)"><i class="bi bi-x-circle"></i></a></span>';
                FavListHtml += '</div>';
                FavListHtml += '</div>';
                FavListHtml += '</div>';
            }
        }

    }
    $("#ContactListDiv").html(conListHtml);
    $("#favContactListDiv").html(FavListHtml);
}
function SetFavorateContact(Id, IsFavorate) {
    $.ajax({
        url: siteUrl + 'Home/SetFavorateContact?Id=' + Id + '&IsFavorate=' + IsFavorate,
        type: 'POST',
        success: function (response) {
            GetContactList();
        },
        error: function (xhr, status, error) {
            Swal.fire({
                title: "Error!",
                text: error,
                icon: "error"
            });
        }
    });
}


$("#searchInputEmail").bind('input', function (e) {
    setTimeout(GetContactList(), 2000)

});
//$("#searchInputEmail").bind('keypress keydown keyup', function (e) {
//    setTimeout(GetContactList(), 2000)
//});
