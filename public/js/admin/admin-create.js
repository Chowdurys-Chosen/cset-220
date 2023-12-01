$(document).ready(function() {
    const dialog = document.querySelector('#dialog')
    const employeeIdInput = $('#employeeId');
    const salaryInput = $('#salary');

    showButton = document.querySelectorAll('.employee-svg');
    showButton.forEach((button) => {
        button.addEventListener('click', () => {
            dialog.showModal();
            employeeIdInput.val(button.dataset.employeeId);
        });
    });
    const closeButton = document.querySelector('#closeDialog');
    closeButton.addEventListener('click', () => {
        dialog.close();
    });
    $(document).on('click', '.employee-svg', function() {
        const employeeId = $(this).data('employee-id');
        // openModal();
        dialog.showModal();
        employeeIdInput.val(employeeId);
    })
    // $('.employee-svg').click(function() {
    //     const employeeId = $(this).data('employee-id');
    //     openModal();
    //     employeeIdInput.val(employeeId);
    // });

    // function openModal() {
    //     modal.removeClass('hidden').addClass('flex')
    // }
    
    // function closeModal() {
    //     modal.addClass('hidden')
    //     salaryInput.val('');
    //     modal.click();
    // }

    $('#updateSalary').click(function() {
        $.ajax({
            url: '/api/updateSalary',
            type: 'POST',
            data: {
                employeeId: employeeIdInput.val(),
                salary: salaryInput.val(),
                _token: "{{ csrf_token() }}"
            },
            success: function(response) {
                if (response.newSalary) {
                    $("#salary-" + employeeIdInput.val()).text(response.newSalary);
                }
                dialog.close();
                salaryInput.val('');
            },
            error: function(error) {
                console.log(error);
            }
        });
    });

    // var fieldMap = {
    //     'id': ['.search-field'],
    //     'name': ['.search-field'],
    //     'salary': ['.salary-field'],
    //     'role_title': ['.search-field']
    // }
    // $("#columnName").change(function() {
    //     var selected = $(this).val();
    //     $('.search-field', '.salary-field', '.name-field').hide();
    //     fieldMap[selected].forEach(function(field) {
    //         $(field).show();
    //     })
    // })
    
    var searchInput = $('#searchInput');
    var minSalary = $('#minSalary');
    var maxSalary = $('#maxSalary');
    var first_name = $('#first_name');
    var last_name = $('#last_name');
    minSalary.hide();
    maxSalary.hide();
    first_name.hide();
    last_name.hide();
    $("#columnName").change(function() {
        var columnName = $(this).val();
        if(columnName === 'id') {
            searchInput.show();
            minSalary.hide();
            maxSalary.hide();
            first_name.hide();
            last_name.hide();
        } else if(columnName === 'name') {
            searchInput.hide();
            first_name.show();
            last_name.show();
        } else if(columnName === 'salary') {
            searchInput.hide();
            first_name.hide();
            last_name.hide();
            minSalary.show();
            maxSalary.show();
        } else if (columnName === 'role_title') {
            searchInput.show();
            first_name.hide();
            last_name.hide();
            minSalary.hide();
            maxSalary.hide();
        }
    });
    $('#searchSubmit').click(function(){
        $.ajax({
            url: '/api/admin/searchEmployee',
            type: 'POST',
            data: {
                columnName: $("#columnName").val(),
                searchInput: $('#searchInput').val(),
                minSalary: $('#minSalary').val(),
                maxSalary: $('#maxSalary').val(),
                first_name: $('#first_name').val(),
                last_name: $('#last_name').val(),
                _token: "{{ csrf_token() }}"
            },
            success: function(response) {
                if(response.message) {
                    handleError();
                } else {
                    searchInput.val('');
                    minSalary.val('');
                    maxSalary.val('');
                    first_name.val('');
                    last_name.val('');
                    updateTable(response.results);
                }
            }
        })
    })
});


function updateTable(data) {
    $("#tBody").empty();
    // var resultsArray = Array.isArray(data.results) ? data.results : [data.results];
    var resultsArray = Array.isArray(data) ? data : [data];

    resultsArray.forEach(function(employee) {
        var fullName = employee.user.first_name + " " + employee.user.last_name;
        var roleTitle = employee.user.role.role_title.charAt(0).toUpperCase() + employee.user.role.role_title.slice(1);

        var employeeRow = `
            <tr>
                <td class="px-3 py-2 text-center align-middle">${employee.id}</td>
                <td class="px-3 py-2 text-center align-middle">${fullName}</td>
                <td class="px-3 py-2 text-center align-middle">${roleTitle}</td>
                <td class="px-3 py-2 text-center align-middle">
                    <div class="flex min-w-full justify-center items-center">
                        <div class="flex-1"></div>
                        <span id="salary-${employee.id}" class="flex-1 text-center">${employee.salary}</span>
                        <svg id="employee-${employee.id}" data-employee-id="${employee.id}" data-modal-target="crud-modal" data-modal-toggle="crud-modal" class="w-6 h-6 text-gray-800 dark:text-white cursor-pointer flex-1 right-0 employee-svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17v1a.97.97 0 0 1-.933 1H1.933A.97.97 0 0 1 1 18V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 1h8.239A.97.97 0 0 1 15 2M6 1v4a1 1 0 0 1-1 1H1m13.14.772 2.745 2.746M18.1 5.612a2.086 2.086 0 0 1 0 2.953l-6.65 6.646-3.693.739.739-3.692 6.646-6.646a2.087 2.087 0 0 1 2.958 0Z"/>
                        </svg>
                    </div>
                </td>
            </tr>
        `;

        $("#tBody").append(employeeRow);
    });
}

function handleError() {
    $("#tBody").empty();
    var errorRow = `
        <tr>
            <td class="px-3 py-2 text-center align-middle" colspan="4">No results found</td>
        </tr>
    `;
    $("#tBody").append(errorRow);
}
