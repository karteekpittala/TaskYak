function signUpValidator()
{
	 $('#signup').bootstrapValidator({
               container: '#messages',
             
              fields: {
                  email: {
                      validators: {
                          notEmpty: {
                             message: 'The email is required and cannot be empty'
                          },
                          emailAddress: {
                              message: 'The input is not a valid email address'
                          }
                      }
                  },
                  firstName: {
                      validators: {
                          notEmpty: {
                              message: 'First name is required and cannot be empty'
                          }
                      }
                  },
                  lastName: {
                      validators: {
                          notEmpty: {
                              message: 'Last name is required and cannot be empty'
                          }
                      }
                  },
                  password: {
                   
                      validators: {
                          notEmpty: {
                              message: 'Password is required and cannot be empty'
                          },
                          
                      }
                  },
                  confirm_password: {
                    enabled: false,
                      validators: {
                          notEmpty: {
                              message: 'Confirm Passsword is required and cannot be empty'
                          },
                          identical: {
                            field: 'password',
                            message: 'The password and its confirm must be the same'
                        }
                      }
                  }

              }
            })
            // Enable the password/confirm password validators if the password is not empty
                    .on('keyup', '[name="password"]', function() {
                        var isEmpty = $(this).val() == '';
                        $('#signup')
                                .bootstrapValidator('enableFieldValidators', 'password', !isEmpty)
                                .bootstrapValidator('enableFieldValidators', 'confirm_password', !isEmpty);

                        // Revalidate the field when user start typing in the password field
                        if ($(this).val().length == 1) {
                            $('#signup').bootstrapValidator('validateField', 'password')
                                            .bootstrapValidator('validateField', 'confirm_password');
                        }
                    });
}




function addtaskValidator()
{
	
	 $('#addtask').bootstrapValidator({
        
              message: 'This value is not valid',
              fields:
              {
                        taskName: {
                            validators: {
                                notEmpty: {
                                    message: 'Please enter the task name'
                                },
                                stringLength: {
                       				 enabled: true,
                        			 min: 5,
                       				 max: 40,
                        			 message: 'The task description must be more than 5 characters long'
                    			}
     
                            }
                        },
                        taskPriority: {
                            validators: {
                                notEmpty: {
                                    message: 'Please enter the task points'
                                },
                                
                                between: {
                        			min: 1,
                        			max: 100,
                       				 message: 'Points must be numeric and less than 100'
                    			}
                            }
                         }
              }

            }); 
}
 
  function listroommatesValidator()
  {
  		$('#listroommates').bootstrapValidator({
        
              message: 'This value is not valid',
              fields:
              {
                        inputGroupName: {
                            validators: {
                                notEmpty: {
                                    message: 'Please enter the group name'
                                },
     
                            }
                         }
               },
         });

  }