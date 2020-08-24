# **Time-Manager** ⏰

**API REST para facilitar o gerenciamento de horários.**

---

## Requirements 📋

- Node.js

## Getting Started 🎬

### Clone the repository

    $ git clone https://github.com/Tutuviz/time-manager.git

    $ cd time-manager

### Dependencies

    $ npm install

### Running

    $ npm start

# Endpoints 📌

**Toda a documentação pode ser encrontrada em: https://explore.postman.com/templates/11833/time-manager**

- [Criar Regra](##Criar-Regra)

- [Remover Regra](##Remover-Regra)

- [Listar Regra](##Listar-Regra)

- [Listar Regra com Intervalos](##Listar-Regra-Com-Intervalos)

---

## Criar Regra ➕

##### **Método:** POST

##### **Host:** localhost:8081

##### **Rota:** /create

Request:

```json
{
	"day": "25-06-2018",
	"intervals": [
		{
			"start": "09:30",
			"end": "10:20"
		}
	]
}
```

Return:

```json
{
	"message": "Created"
}
```

> Na criação de regras é possivel determinar o dia da semana utilizando _0-6_ ou então todos os dias utilizando _"everyday"_, além de ser possível passar mais de um interval

---

## Remover Regra 🗑️

##### **Método:** DELETE

##### **Host:** localhost:8081

##### **Rota:** /delete

Request:

```json
{
	"day": "25-06-2018",
	"intervals": [
		{
			"start": "09:30",
			"end": "10:20"
		}
	]
}
```

Return:

```json
{
	"message": "Created"
}
```

> Para deletar é necessário passar o objeto completo, não apenas um intervalo específico

---

## Listar Regra 📋

##### **Método:** GET

##### **Host:** localhost:8081

##### **Rota:** /list

Request:

> No body

Return:

```json
[
	{
		"day": "25-06-2018",
		"intervals": [
			{
				"start": "09:30",
				"end": "10:20"
			}
		]
	}
]
```

> O get retornará todos os dias entre o intervalo, com exceção dos dias da semana

---

## Listar Regra com Intervalos 📅

##### **Método:** GET

##### **Host:** localhost:8081

##### **Rota:** /listIn

Request:

```json
{
	"from": "22-06-2018",
	"to": "25-08-2018"
}
```

Return:

```json
[
	{
		"day": "25-06-2018",
		"intervals": [
			{
				"start": "09:30",
				"end": "10:20"
			}
		]
	}
]
```
