const nodemailer = require('nodemailer');
const accountModel = require('../model/account');
const mailConfig = require('../config/mail')
require('dotenv/config')

class authController {
  async forgetPassword(req, res) {
    try {
      const { email } = req.body;

      const existingAccount = await accountModel.findOne({ $or: [{ email }] });

      if (!existingAccount) {
        return res.status(400).json({ error: 'Email chưa đăng ký tài khoản nào !' });
      }

      const transporter = nodemailer.createTransport({
        tls: {
          rejectUnauthorized: false
        },
        host: mailConfig.HOST,
        port: mailConfig.PORT,
        secure: false,
        auth: {
          user: mailConfig.USERNAME,
          pass: mailConfig.PASSWORD,
        },
      });

      const mailOptions = {
        from: mailConfig.FROM_ADDRESS,
        to: email,
        subject: 'MIX FOOD - Quên mật khẩu',
        text: `
            MIX FOOD
            
            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi, 

            Chúng tôi xin gửi lại mật khẩu của bạn là: ${existingAccount.password}.
            `,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error('Có lỗi khi gửi lại mật khẩu', error);
        } else {
          console.log('Gửi lại mật khẩu thành công');
        }
      });
      return res.status(200).json({ message: 'Gửi mật khẩu tài khoản thành công' });
    } catch (error) {
      console.error('Error forget password', error);
      return res.status(500).json({ error: 'Failed to forget password' });
    }
  }
  async signUp(req, res) {
    try {
      const { name, phone, email, password } = req.body;

      const existingAccount = await accountModel.findOne({ $or: [{ email }, { phone }] });

      if (existingAccount) {
        return res.status(400).json({ error: 'Email hoặc số điện thoại đã tồn tại' });
      }

      const codeLength = 6;
      const characters = '0123456789';
      let verificationCodeProgress = '';

      for (let i = 0; i < codeLength; i++) {
        verificationCodeProgress += characters.charAt(Math.floor(Math.random() * characters.length));
      }

      const verificationCode = verificationCodeProgress

      const newAccount = new accountModel({ name, phone, email, password, verificationCode });

      const savedAccount = await newAccount.save();

      const transporter = nodemailer.createTransport({
        tls: {
          rejectUnauthorized: false
        },
        host: mailConfig.HOST,
        port: mailConfig.PORT,
        secure: false,
        auth: {
          user: mailConfig.USERNAME,
          pass: mailConfig.PASSWORD,
        },
      });

      const mailOptions = {
        from: mailConfig.FROM_ADDRESS,
        to: email,
        subject: 'MIX FOOD - Xác thực tài khoản',
        text: `
                MIX FOOD
                
                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi, 
    
                Chúng tôi xin gửi mã xác thực của bạn là: ${verificationCode}.
                `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending verification email', error);
        } else {
          console.log('Verification email sent', info.response);
        }
      });
      return res.status(200).json({ message: 'Đăng ký tài khoản thành công' });
    } catch (error) {
      console.error('Error signing up', error);
      return res.status(500).json({ error: 'Failed to sign up' });
    }
  }

  // post: verify account
  async verifyAccount(req, res) {
    try {
      const { email, verificationCode } = req.body;
      const account = await accountModel.findOne({ email, verificationCode });

      if (!account) {
        return res.status(400).json({ error: 'Sai mã xác thực' });
      }
      account.isVerified = true;
      await account.save();

      return res.status(200).json({ message: 'Xác thực tài khoản thành công' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async signIn(req, res) {
    try {
      const { email, password } = req.body;

      // Kiểm tra tài khoản với email và mật khẩu
      const account = await accountModel.findOne({ email });

      if (!account) {
        return res.status(400).json({ error: 'Email không tồn tại' });
      }

      if (account.password !== password) {
        return res.status(400).json({ error: 'Mật khẩu không chính xác' });
      }
      const formResponse = {
        id: account._id,
        name: account.name,
        email: account.email,
        phone: account.phone,
        isVerified: account.isVerified,
        rules: account.rules
      }
      return res.json(formResponse);
      res.status(200).json({ message: 'Đăng nhập thành công' });
    } catch (error) {
      console.error('Error signing in', error);
      res.status(500).json({ error: 'Failed to sign in' });
    }
  }

  async update(req, res) {
    try {
      const { email, name, phone } = req.body;

      // Kiểm tra tài khoản với email
      const account = await accountModel.findOne({ email });

      if (!account) {
        return res.status(400).json({ error: 'Email không tồn tại' });
      }

      // Cập nhật tên và số điện thoại của tài khoản
      account.name = name;
      account.phone = phone;
      await account.save();

      return res.status(200).json({ message: 'Cập nhật thông tin thành công' });
    } catch (error) {
      console.error('Error updating account', error);
      res.status(500).json({ error: 'Failed to update account' });
    }
  }

  async changePassword(req, res) {
    try {
      const { email, currentPassword, newPassword } = req.body;

      // Kiểm tra tài khoản với email và mật khẩu hiện tại
      const account = await accountModel.findOne({ email });

      if (!account) {
        return res.status(400).json({ error: 'Email không tồn tại' });
      }

      if (account.password !== currentPassword) {
        return res.status(400).json({ error: 'Mật khẩu hiện tại không chính xác' });
      }

      // Đổi mật khẩu
      account.password = newPassword;
      await account.save();

      return res.status(200).json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
      console.error('Error changing password', error);
      res.status(500).json({ error: 'Failed to change password' });
    }
  }
}

module.exports = new authController();
