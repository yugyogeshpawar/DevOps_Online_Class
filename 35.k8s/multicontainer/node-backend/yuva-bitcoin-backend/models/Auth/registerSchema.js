const registerSchema = {
    type: 'object',
    properties: {
      sponcer_id: { type: 'string' },
      contactNo: { type: 'string' },
      member_name: { type: 'string' },
      password: { type: 'string' },
      cpassword: { type: 'string' },
      email: { type: 'string' }
    },
    required: ['sponcer_id', 'contactNo', 'member_name', 'password', 'cpassword', 'email']
  };
  