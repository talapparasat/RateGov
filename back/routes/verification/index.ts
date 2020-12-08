import verificationController from "@controllers/verification";
import router from "@routes/auth";
import isAuth from '@mw/validators/isAuth'

router.get('/send-sms', isAuth, async (req: any, res: any) => {

    try {

        const userId = req.user._id;
        const phone = req.user.phone.mobile[0];

        if(!phone) {
            res.status(400).send({error: 'no phone number'})
        }

        const respond = await verificationController.resend(
            userId,
            phone
        );

        res.status(200).send(respond);

    } catch (err) {
        res.status(400).send(err);
    }

});

router.post('/phone', isAuth, async (req: any, res: any) => {

    try {

        const userId = req.user._id;
        const code = req.body.code;

        const verifyUser = await verificationController.verify(
            userId,
            code
        );

        res.status(200).send(verifyUser);

    } catch (err) {
        res.status(400).send(err);
    }

});


router.get('/phone/resend', isAuth, async (req: any, res: any) => {

    try {

        const userId = req.user._id;
        const phone = req.user.phone;

        const resendCode = await verificationController.resend(
            userId,
            phone.mobile[0]
        );

        res.status(200).send(resendCode);

    } catch (err) {
        res.status(400).send(err);
    }

});

export default router;