export default async function handler(req, res) {
     res.removeHeader("X-Frame-Options");
    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "*"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,OPTIONS"
    );

    if(req.method==="OPTIONS"){

        return res.status(200).end();

    }

    try{

        const token=req.query.url;

        if(!token){

            return res.status(400).json({
                ok:false
            });

        }

        const decoded=Buffer
            .from(token,"base64")
            .toString("utf8");

        let url=decoded;

        if(decoded.startsWith("{")){

            const obj=JSON.parse(decoded);

            url=obj.u||obj.url;

        }

        return res.json({

            ok:true,

            url

        });

    }catch(e){

        return res.status(500).json({

            ok:false,

            error:e.message

        });

    }

}
