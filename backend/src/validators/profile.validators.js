const { body }=require('express-validator');
const profileValidator=[
 body('foto_url').optional({nullable:true,checkFalsy:true}).trim().isURL().withMessage('La foto debe ser una URL válida.'),
 body('foto_perfil_url').optional({nullable:true,checkFalsy:true}).trim().isURL().withMessage('foto_perfil_url debe ser una URL válida.'),
 body('descripcion').optional({nullable:true,checkFalsy:true}).trim().isLength({max:1000}).withMessage('La descripción no debe superar 1000 caracteres.'),
 body('descripcion_personal').optional({nullable:true,checkFalsy:true}).trim().isLength({max:1000}).withMessage('La descripción personal no debe superar 1000 caracteres.'),
 body('ciudad').optional({nullable:true,checkFalsy:true}).trim().isLength({max:120}),
 body('departamento').optional({nullable:true,checkFalsy:true}).trim().isLength({max:120}),
 body('sitio_web').optional({nullable:true,checkFalsy:true}).trim().isURL().withMessage('El sitio web debe ser una URL válida.')
];
module.exports={profileValidator};
