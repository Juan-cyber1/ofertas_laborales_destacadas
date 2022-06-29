let urlDest = "/agencia-empleo/_api/web/Lists/getbytitle('ofertas-laborales-destacadas')/items?&select=ID,titulo_card,descipcion_card,info_modal,CTA_oferta,imagen_card_1,fecha_actual";
const contOfertas = document.getElementById('cont-ofertas');


let FECHA_ACTUAL = new Date();
let year = FECHA_ACTUAL.getFullYear();
month = FECHA_ACTUAL.getUTCMonth() + 1;
day = FECHA_ACTUAL.getUTCDate();
mes = month.toString();
dia = day.toString();
calculo = mes.length;
calculo = (calculo == 1) ? "0" + month : month;
calculo_day = dia.length;
calculo_day = (calculo_day == 1) ? "0" + day : day;
FECHA_ACTUAL_FORMATEADA = `${year}-${calculo}-${calculo_day}`;

function getData() {
    fetch(urlDest, {
            method: 'GET',
            headers: {
                "accept": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose",
                "X-RequestDigest": $("#_REQUESTDIGEST").val()
            },
        })
        .then(response => response.json())
        .then(data => mostrarData(data))
        .catch(error => console.log(error))
}

const mostrarData = (data) => {
    let contData = data.d.results;
    let mapCards = contData.map(item => {
        let idEl = item.ID;
        let tituloCard = item.titulo_card;
        let descCard = item.descipcion_card;
        let infoModal = item.info_modal;
        let CTA_ofertas = item.CTA_oferta;
        let CTA_ofertasUrl = "";
        let nombreBtnModal = item.name_btn_modal;
        if (CTA_ofertas == "" || CTA_ofertas == null) {
            CTA_ofertas == ""
        } else {
            let title_CTA_ofertas = item.CTA_oferta.Description;
            CTA_ofertasUrl = `<a target="_blank" rel="noopener noreferrer" href="${CTA_ofertas.Url}" title="${title_CTA_ofertas}" class="btn btn-green">${title_CTA_ofertas}</a>`
        }

        let imagenCard = item.imagen_card_1;
        let descImgCard = imagenCard.Description;
        let fecha_limite = item.fecha_actual;
        let splitFecha = fecha_limite.split("T");
        let fechaLimite = splitFecha[0];



        if (fechaLimite >= FECHA_ACTUAL_FORMATEADA) {
            let Card = ""

            if (imagenCard == "" || imagenCard == null) { Card = "" } else {
                Card = `<div class="card cards_ofertas_dest">
              <img class="card-img-top img-rounded" src="${imagenCard.Url}" alt="${descImgCard}"/>
              <div class="card-body">
              <h3 class="card-title">${tituloCard}</h3>
              <p class="card-text">${descCard}</p>
              <a href="#" class="btn btn-green btn-modal" data-toggle="modal" data-target="#modal_${idEl}">
              ${nombreBtnModal}
            </a>
              </div>
              </div>`

            }

            let retorno = { idEl, tituloCard, Card, descImgCard, descCard, infoModal, CTA_ofertas, CTA_ofertasUrl, Card, nombreBtnModal }
            createCard(retorno);
        }


    })
    let cards = document.getElementsByClassName('cards_ofertas_dest');
    let numCards = cards.length;
    if (numCards == 0) {
        contOfertas.style.display = "none";
    }
}

const createCard = retorno => {
    $("#contenedorCard").append(
        `
${retorno.Card}
        `
    );

    $(document).ready(function() {

        $('#contenedorCard').slick({
            dots: true,
            infinite: true,
            speed: 300,
            slidesToShow: 3,
            slidesToScroll: 2,
            arrows: true,
            prevArrow: "<i class='slick-prev' title='Ir izquierda' aria-hidden='true'></i>",
            nextArrow: "<i class='slick-next' title='Ir derecha' aria-hidden='true'></i>",
            responsive: [{
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 2,
                        infinite: true,
                        dots: true
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                        adaptiveHeight: true,
                        dots: true
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        adaptiveHeight: true
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        adaptiveHeight: true
                    }
                }
            ]
        })
    });


    $('#modals').append(`
    <div class="modal fade" id="modal_${retorno.idEl}" tabindex="-1" role="dialog" aria-labelledby="modal_${retorno.idEl}Label" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
          <h3 class="modal-title" id="modal_${retorno.idEl}Label">${retorno.tituloCard}</h3>
        </div>
        <div class="modal-body">
        ${retorno.infoModal}
        </div>
        <div class="modal-footer">
        ${retorno.CTA_ofertasUrl}
          <button type="button" class="btn btn-green-close" data-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
    `)

}

getData()