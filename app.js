const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')



const flowAtencion = addKeyword(['3', "B", "b"])
    .addAnswer(['Adiós, lamento no haberte podido ayudar 👋🤖', 'En un momento te conecto con uno de mis humanos preferidos de grupo *ARDA*, recuerda que puedes llamarme en cualquier momento diciendo mi nombre (ArdaBot)']
    );

const flowInformacion = addKeyword('1')
    .addAnswer([
        '*IMPORTANTE*', '⭕Puedes asistir a entrevista cualquier día de Lunes a viernes en de 9:00 a 4:00 pm',
        'Solicitamos ayudantes Generales',
        ' ',
        '🫴 Ofrecemos: 🫴',
        '➖$1519 libres semanales',
        '➖Vale de despensa mensual $306',
        '➖Premio de puntualidad mensual $231',
        '➖Vale de despensa anual $1050',
        '➖Seguro de vida sin descuentos a la nómina',
        '➖Días festivos superiores a los de la ley',
        '➖Aguinaldo superior a la ley (19 días)',
        '➖Uniformes gratis al 3er mes',
        '➖Infonavit, Fonacot, IMSS',
        '➖Becas para hijos (Anual)',
        '➖Mucha oportunidad de tiempos extras',
        ' ',
        '📄 Requisitos 📄',
        '➖Documentos en regla',
        '➖Disponibilidad de Rol de 2 turnos de 12 horas. (Hombres)',
        '➖Disponibilidad para rolar 3 turnos de 8 horas (Mujeres)',
        '➖Escolaridad mínima Primaria.',
        ' ',
        '🕓 Horarios 🕓',
        '➖Día : Lunes a Jueves de 6:00 am a 6:00 pm',
        '➖Nocturno: Lunes a Jueves de 6:00 pm a 6:00 am',
        '(Se rolan cada 2 semanas)',
        ' ',])
    .addAnswer(['*A)* Repetir nuestro menú de opciones',
        '*B)* Apagar a "ArdaBot" y mandar mensaje directo'],
        {
            capture: true
        }, async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
            const menu=["a","A"]
            if (!["a", "A", "b", "B"].includes(ctx.body.toLowerCase().trim())) {
                await flowDynamic(['❌ Opcion no valida, por favor seleccione una opcion valida.'])
                await fallBack()
                return
            } else
                if (menu.includes(ctx.body.toLowerCase().trim())) {
                    gotoFlow(flowMenu)
                } else {
                    gotoFlow(flowAtencion)
                }
        }
    )

const flowUbicacion = addKeyword('2')
    .addAnswer('Link de la Ubicación: https://goo.gl/maps/yMSstJruPsrg91Wd6')
    .addAnswer(['*A)* Repetir nuestro menú de opciones',
        '*B)* Apagar a "ArdaBot" y mandar mensaje directo'],
        {
            capture: true
        }, async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
            const menu=["a","A"]
            if (!["a", "A", "b", "B"].includes(ctx.body.toLowerCase().trim())) {
                await flowDynamic(['❌ Opcion no valida, por favor seleccione una opcion valida.'])
                await fallBack()
                return
            } else
                if (menu.includes(ctx.body.toLowerCase().trim())) {
                    gotoFlow(flowMenu)
                } else {
                    gotoFlow(flowAtencion)
                }
        }
    )



const flowMenu = addKeyword(["a", "A"])
    .addAnswer(
        [
            'Te comparto nuestro menú de opciones (Escriba el número de la opción a la que deseas navegar)',
            '*1)* Información de nuestras vacantes',
            '*2)* Ubicación de nuestra empresa',
            '*3)* Apagar a "ArdaBot" y mandar mensaje directo'
        ],
        { capture: true },
        async (ctx, { fallBack, flowDynamic }) => {
            if (![1, 2, 3].includes(parseInt(ctx.body.toLowerCase().trim()))) {
                await flowDynamic(['❌ Opcion no valida, por favor seleccione una opcion valida.'])
                await fallBack()
                return
            }
        },
        [flowInformacion, flowUbicacion, flowAtencion]
    )

const flowPrincipal = addKeyword(["ArdaBot", "ardabot", "ARDABOT", "ArdaBot", "ardaBot"], { sensitive: true })
    .addAnswer('Hola soy "ArdaBot" 👋🤖, el asistente virtual de grupo *ARDA* ', '¿En qué puedo ayudarte el día de hoy?')
    .addAnswer(
        [
            'Te comparto nuestro menú de opciones (Escriba el número de la opción a la que deseas navegar)',
            '*1)* Información de nuestras vacantes',
            '*2)* Ubicación de nuestra empresa',
            '*3)* Apagar a "ArdaBot" y mandar mensaje directo'
        ],
        { capture: true },
        async (ctx, { fallBack, flowDynamic }) => {
            if (![1, 2, 3].includes(parseInt(ctx.body.toLowerCase().trim()))) {
                await flowDynamic(['❌ Opcion no valida, por favor seleccione una opcion valida.'])
                await fallBack()
                return
            }
        },
        [flowInformacion, flowUbicacion, flowAtencion]
    )



const flowWelcome = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, { flowDynamic, state }) => {

        const myState = state.getMyState()
        if (!myState) {

            state.update({ welcome: "enviado" })

            flowDynamic('Hola, este es un mensaje generado automáticamente, si deseas que nuestro asistente virtual te proporcione alguna información, simplemente escribe "ArdaBot". De lo contrario, puedes ignorar este mensaje. ¡Que tengas un excelente día!')

        }
    }
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowWelcome, flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    Rodo = createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    },
        {
            state: { encendido: true },
        })
    QRPortalWeb()
}

main()
