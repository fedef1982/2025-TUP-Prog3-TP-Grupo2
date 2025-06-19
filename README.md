<a name="readme-top"></a>
# 2025-TUP-Prog3-TP-Grupo2

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://docs.google.com/document/d/1Tp3NS1_4iSdxhbV2G0Gn1zKr3-Gh8gFu/edit?usp=sharing&ouid=109882683574158321015&rtpof=true&sd=true">
    <img src="./frontend/public/adoptar_logo.png" alt="Logo" width="100" height="90">
  </a>

  <h3 align="center">AdoptAR</h3>

  <p align="center">
    <a href="https://docs.google.com/document/d/1Tp3NS1_4iSdxhbV2G0Gn1zKr3-Gh8gFu/edit?usp=sharing&ouid=109882683574158321015&rtpof=true&sd=true"><strong>Accede a la documentación »</strong></a>
  </p>
</div>

## Sobre el proyecto

AdoptAR es una aplicación web que facilita la publicación de mascotas en adopción. Permite a usuarios hacer las publicaciones con el detalle de cada mascota y gestionar las visitas para concretar la adopción.

## Alcance del sistema

<ul>
  <li>Registro de usuarios.</li>
  <li>Sistema de autenticación y control de acceso por rol (admin, publicador).</li>
  <li>Publicación de mascotas en adopción (con fotos e información relevante).</li>
  <li>Gestión de formularios de visita creados por los usuarios interesados en la adopción.</li>
  <li>Seguimiento del estado de formularios de visita.</li>

</ul>

## Tecnologías

<ul>
  <li>Frontend: Next.js, TypeScript, Tailwind CSS.</li>
  <li>Backend: NestJS, TypeScript, Sequelize.</li>
  <li>Base de datos: PostgreSQL.</li>
  <li>Autenticación: JWT.</li>
  <li>ORM: Sequelize-TypeScript.</li>
</ul>

## Colaboradores

<ul>
  <li>Fresco, Federico. - fedef1982@gmail.com</li>
  <li>Reina, Adriel - adriel.a.reina@gmail.com</li>
  <li>Velardez, Marcos - marcosvelardez40@gmail.com</li>
  <li>Rodríguez, Paola - paolarladera@gmail.com</li>
</ul>



## Project setup

```bash
$ npm install
```

## Compilar y levantar el proyecto

```bash
# levantar Frontend y backend
$ npm run dev

# levantar solo Backend
$ npm run dev:back

# levantar solo Frontend
$ npm run dev:front

```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
<p align="right">(<a href="#readme-top">back to top</a>)</p>