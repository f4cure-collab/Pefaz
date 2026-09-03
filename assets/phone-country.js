/**
 * phone-country.js
 *
 * Seletor de pais + validacao + formatacao pra campos de telefone.
 * Uso:
 *   <input id="fone" type="tel" ...>
 *   PhoneCountry.attach(document.getElementById('fone'));
 *
 *   No submit:
 *     if (!PhoneCountry.validate(input)) { showErr(PhoneCountry.errorMsg(input)); return; }
 *     var phone = PhoneCountry.getE164(input);
 *     // Brasil (BR): manda so os digitos, ex "19991234567" (comportamento antigo)
 *     // Outro pais:   manda com + e codigo, ex "+351912000000"
 *
 * Regras:
 *   - Brasil (padrao): DDD + 9 digitos (regex ^\d{11}$), com mascara (00) 00000-0000.
 *   - Qualquer outro pais: 8 a 15 digitos, sem mascara BR, formatacao E.164.
 *
 * Lista de paises: canonica passada pelo agente do sistema (2026-08-25),
 * ordem alfabetica em PT-BR. Nao limitar — quem for de pais fora da lista
 * fica travado.
 */
(function () {
  if (window.PhoneCountry) return; // idempotente

  // ── CSS injetado 1x ───────────────────────────────────────
  function injectCss() {
    if (document.getElementById('phone-country-css')) return;
    var s = document.createElement('style');
    s.id = 'phone-country-css';
    s.textContent =
        '.pc-wrap{display:flex;gap:6px;align-items:stretch}'
      + '.pc-select{flex:0 0 auto;min-width:96px;max-width:140px;padding:0 10px;border:1px solid var(--gray-200,#d0d0d0);border-radius:var(--radius-sm,8px);background:#fff;font:inherit;font-size:.9rem;color:var(--dark-800,#141a20);cursor:pointer;appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23888\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 8px center;padding-right:26px}'
      + '.pc-select:focus{outline:none;border-color:var(--lime-dark,#8fa030)}'
      + '.pc-wrap .pc-input{flex:1 1 auto;min-width:0}';
    document.head.appendChild(s);
  }

  /* Lista canonica: ISO 3166-1 alpha-2 + nome PT-BR (padrao do agente do
     sistema) + DDI (ITU-T E.164) + bandeira emoji. */
  var COUNTRIES = [
    {iso:'BR',name:'Brasil',dial:'55',flag:'🇧🇷'},
    {iso:'AF',name:'Afeganistão',dial:'93',flag:'🇦🇫'},
    {iso:'ZA',name:'África do Sul',dial:'27',flag:'🇿🇦'},
    {iso:'AL',name:'Albânia',dial:'355',flag:'🇦🇱'},
    {iso:'DE',name:'Alemanha',dial:'49',flag:'🇩🇪'},
    {iso:'AD',name:'Andorra',dial:'376',flag:'🇦🇩'},
    {iso:'AO',name:'Angola',dial:'244',flag:'🇦🇴'},
    {iso:'AI',name:'Anguilla',dial:'1264',flag:'🇦🇮'},
    {iso:'AQ',name:'Antártida',dial:'672',flag:'🇦🇶'},
    {iso:'AG',name:'Antígua e Barbuda',dial:'1268',flag:'🇦🇬'},
    {iso:'SA',name:'Arábia Saudita',dial:'966',flag:'🇸🇦'},
    {iso:'DZ',name:'Argélia',dial:'213',flag:'🇩🇿'},
    {iso:'AR',name:'Argentina',dial:'54',flag:'🇦🇷'},
    {iso:'AM',name:'Armênia',dial:'374',flag:'🇦🇲'},
    {iso:'AW',name:'Aruba',dial:'297',flag:'🇦🇼'},
    {iso:'AU',name:'Austrália',dial:'61',flag:'🇦🇺'},
    {iso:'AT',name:'Áustria',dial:'43',flag:'🇦🇹'},
    {iso:'AZ',name:'Azerbaijão',dial:'994',flag:'🇦🇿'},
    {iso:'BS',name:'Bahamas',dial:'1242',flag:'🇧🇸'},
    {iso:'BH',name:'Bahrein',dial:'973',flag:'🇧🇭'},
    {iso:'BD',name:'Bangladesh',dial:'880',flag:'🇧🇩'},
    {iso:'BB',name:'Barbados',dial:'1246',flag:'🇧🇧'},
    {iso:'BE',name:'Bélgica',dial:'32',flag:'🇧🇪'},
    {iso:'BZ',name:'Belize',dial:'501',flag:'🇧🇿'},
    {iso:'BJ',name:'Benin',dial:'229',flag:'🇧🇯'},
    {iso:'BM',name:'Bermudas',dial:'1441',flag:'🇧🇲'},
    {iso:'BY',name:'Bielorrússia',dial:'375',flag:'🇧🇾'},
    {iso:'BO',name:'Bolívia',dial:'591',flag:'🇧🇴'},
    {iso:'BA',name:'Bósnia e Herzegovina',dial:'387',flag:'🇧🇦'},
    {iso:'BW',name:'Botsuana',dial:'267',flag:'🇧🇼'},
    {iso:'BN',name:'Brunei',dial:'673',flag:'🇧🇳'},
    {iso:'BG',name:'Bulgária',dial:'359',flag:'🇧🇬'},
    {iso:'BF',name:'Burkina Faso',dial:'226',flag:'🇧🇫'},
    {iso:'BI',name:'Burundi',dial:'257',flag:'🇧🇮'},
    {iso:'BT',name:'Butão',dial:'975',flag:'🇧🇹'},
    {iso:'CV',name:'Cabo Verde',dial:'238',flag:'🇨🇻'},
    {iso:'CM',name:'Camarões',dial:'237',flag:'🇨🇲'},
    {iso:'KH',name:'Camboja',dial:'855',flag:'🇰🇭'},
    {iso:'CA',name:'Canadá',dial:'1',flag:'🇨🇦'},
    {iso:'QA',name:'Catar',dial:'974',flag:'🇶🇦'},
    {iso:'KZ',name:'Cazaquistão',dial:'7',flag:'🇰🇿'},
    {iso:'TD',name:'Chade',dial:'235',flag:'🇹🇩'},
    {iso:'CL',name:'Chile',dial:'56',flag:'🇨🇱'},
    {iso:'CN',name:'China',dial:'86',flag:'🇨🇳'},
    {iso:'CY',name:'Chipre',dial:'357',flag:'🇨🇾'},
    {iso:'SG',name:'Cingapura',dial:'65',flag:'🇸🇬'},
    {iso:'CO',name:'Colômbia',dial:'57',flag:'🇨🇴'},
    {iso:'KM',name:'Comores',dial:'269',flag:'🇰🇲'},
    {iso:'CG',name:'Congo',dial:'242',flag:'🇨🇬'},
    {iso:'CD',name:'Congo (RDC)',dial:'243',flag:'🇨🇩'},
    {iso:'KP',name:'Coreia do Norte',dial:'850',flag:'🇰🇵'},
    {iso:'KR',name:'Coreia do Sul',dial:'82',flag:'🇰🇷'},
    {iso:'CI',name:'Costa do Marfim',dial:'225',flag:'🇨🇮'},
    {iso:'CR',name:'Costa Rica',dial:'506',flag:'🇨🇷'},
    {iso:'HR',name:'Croácia',dial:'385',flag:'🇭🇷'},
    {iso:'CU',name:'Cuba',dial:'53',flag:'🇨🇺'},
    {iso:'CW',name:'Curaçao',dial:'599',flag:'🇨🇼'},
    {iso:'DK',name:'Dinamarca',dial:'45',flag:'🇩🇰'},
    {iso:'DJ',name:'Djibuti',dial:'253',flag:'🇩🇯'},
    {iso:'DM',name:'Dominica',dial:'1767',flag:'🇩🇲'},
    {iso:'EG',name:'Egito',dial:'20',flag:'🇪🇬'},
    {iso:'SV',name:'El Salvador',dial:'503',flag:'🇸🇻'},
    {iso:'AE',name:'Emirados Árabes Unidos',dial:'971',flag:'🇦🇪'},
    {iso:'EC',name:'Equador',dial:'593',flag:'🇪🇨'},
    {iso:'ER',name:'Eritreia',dial:'291',flag:'🇪🇷'},
    {iso:'SK',name:'Eslováquia',dial:'421',flag:'🇸🇰'},
    {iso:'SI',name:'Eslovênia',dial:'386',flag:'🇸🇮'},
    {iso:'ES',name:'Espanha',dial:'34',flag:'🇪🇸'},
    {iso:'US',name:'Estados Unidos',dial:'1',flag:'🇺🇸'},
    {iso:'EE',name:'Estônia',dial:'372',flag:'🇪🇪'},
    {iso:'SZ',name:'Eswatini',dial:'268',flag:'🇸🇿'},
    {iso:'ET',name:'Etiópia',dial:'251',flag:'🇪🇹'},
    {iso:'FJ',name:'Fiji',dial:'679',flag:'🇫🇯'},
    {iso:'PH',name:'Filipinas',dial:'63',flag:'🇵🇭'},
    {iso:'FI',name:'Finlândia',dial:'358',flag:'🇫🇮'},
    {iso:'FR',name:'França',dial:'33',flag:'🇫🇷'},
    {iso:'GA',name:'Gabão',dial:'241',flag:'🇬🇦'},
    {iso:'GM',name:'Gâmbia',dial:'220',flag:'🇬🇲'},
    {iso:'GH',name:'Gana',dial:'233',flag:'🇬🇭'},
    {iso:'GE',name:'Geórgia',dial:'995',flag:'🇬🇪'},
    {iso:'GI',name:'Gibraltar',dial:'350',flag:'🇬🇮'},
    {iso:'GD',name:'Granada',dial:'1473',flag:'🇬🇩'},
    {iso:'GR',name:'Grécia',dial:'30',flag:'🇬🇷'},
    {iso:'GL',name:'Groenlândia',dial:'299',flag:'🇬🇱'},
    {iso:'GP',name:'Guadalupe',dial:'590',flag:'🇬🇵'},
    {iso:'GU',name:'Guam',dial:'1671',flag:'🇬🇺'},
    {iso:'GT',name:'Guatemala',dial:'502',flag:'🇬🇹'},
    {iso:'GG',name:'Guernsey',dial:'44',flag:'🇬🇬'},
    {iso:'GY',name:'Guiana',dial:'592',flag:'🇬🇾'},
    {iso:'GF',name:'Guiana Francesa',dial:'594',flag:'🇬🇫'},
    {iso:'GN',name:'Guiné',dial:'224',flag:'🇬🇳'},
    {iso:'GQ',name:'Guiné Equatorial',dial:'240',flag:'🇬🇶'},
    {iso:'GW',name:'Guiné-Bissau',dial:'245',flag:'🇬🇼'},
    {iso:'HT',name:'Haiti',dial:'509',flag:'🇭🇹'},
    {iso:'NL',name:'Holanda',dial:'31',flag:'🇳🇱'},
    {iso:'HN',name:'Honduras',dial:'504',flag:'🇭🇳'},
    {iso:'HK',name:'Hong Kong',dial:'852',flag:'🇭🇰'},
    {iso:'HU',name:'Hungria',dial:'36',flag:'🇭🇺'},
    {iso:'YE',name:'Iêmen',dial:'967',flag:'🇾🇪'},
    {iso:'IM',name:'Ilha de Man',dial:'44',flag:'🇮🇲'},
    {iso:'KY',name:'Ilhas Cayman',dial:'1345',flag:'🇰🇾'},
    {iso:'CK',name:'Ilhas Cook',dial:'682',flag:'🇨🇰'},
    {iso:'FO',name:'Ilhas Faroe',dial:'298',flag:'🇫🇴'},
    {iso:'FK',name:'Ilhas Malvinas',dial:'500',flag:'🇫🇰'},
    {iso:'MH',name:'Ilhas Marshall',dial:'692',flag:'🇲🇭'},
    {iso:'SB',name:'Ilhas Salomão',dial:'677',flag:'🇸🇧'},
    {iso:'TC',name:'Ilhas Turcas e Caicos',dial:'1649',flag:'🇹🇨'},
    {iso:'VI',name:'Ilhas Virgens Americanas',dial:'1340',flag:'🇻🇮'},
    {iso:'VG',name:'Ilhas Virgens Britânicas',dial:'1284',flag:'🇻🇬'},
    {iso:'IN',name:'Índia',dial:'91',flag:'🇮🇳'},
    {iso:'ID',name:'Indonésia',dial:'62',flag:'🇮🇩'},
    {iso:'IR',name:'Irã',dial:'98',flag:'🇮🇷'},
    {iso:'IQ',name:'Iraque',dial:'964',flag:'🇮🇶'},
    {iso:'IE',name:'Irlanda',dial:'353',flag:'🇮🇪'},
    {iso:'IS',name:'Islândia',dial:'354',flag:'🇮🇸'},
    {iso:'IL',name:'Israel',dial:'972',flag:'🇮🇱'},
    {iso:'IT',name:'Itália',dial:'39',flag:'🇮🇹'},
    {iso:'JM',name:'Jamaica',dial:'1876',flag:'🇯🇲'},
    {iso:'JP',name:'Japão',dial:'81',flag:'🇯🇵'},
    {iso:'JE',name:'Jersey',dial:'44',flag:'🇯🇪'},
    {iso:'JO',name:'Jordânia',dial:'962',flag:'🇯🇴'},
    {iso:'KW',name:'Kuwait',dial:'965',flag:'🇰🇼'},
    {iso:'LA',name:'Laos',dial:'856',flag:'🇱🇦'},
    {iso:'LS',name:'Lesoto',dial:'266',flag:'🇱🇸'},
    {iso:'LV',name:'Letônia',dial:'371',flag:'🇱🇻'},
    {iso:'LB',name:'Líbano',dial:'961',flag:'🇱🇧'},
    {iso:'LR',name:'Libéria',dial:'231',flag:'🇱🇷'},
    {iso:'LY',name:'Líbia',dial:'218',flag:'🇱🇾'},
    {iso:'LI',name:'Liechtenstein',dial:'423',flag:'🇱🇮'},
    {iso:'LT',name:'Lituânia',dial:'370',flag:'🇱🇹'},
    {iso:'LU',name:'Luxemburgo',dial:'352',flag:'🇱🇺'},
    {iso:'MO',name:'Macau',dial:'853',flag:'🇲🇴'},
    {iso:'MK',name:'Macedônia do Norte',dial:'389',flag:'🇲🇰'},
    {iso:'MG',name:'Madagascar',dial:'261',flag:'🇲🇬'},
    {iso:'MY',name:'Malásia',dial:'60',flag:'🇲🇾'},
    {iso:'MW',name:'Malaui',dial:'265',flag:'🇲🇼'},
    {iso:'MV',name:'Maldivas',dial:'960',flag:'🇲🇻'},
    {iso:'ML',name:'Mali',dial:'223',flag:'🇲🇱'},
    {iso:'MT',name:'Malta',dial:'356',flag:'🇲🇹'},
    {iso:'MA',name:'Marrocos',dial:'212',flag:'🇲🇦'},
    {iso:'MQ',name:'Martinica',dial:'596',flag:'🇲🇶'},
    {iso:'MU',name:'Maurício',dial:'230',flag:'🇲🇺'},
    {iso:'MR',name:'Mauritânia',dial:'222',flag:'🇲🇷'},
    {iso:'MX',name:'México',dial:'52',flag:'🇲🇽'},
    {iso:'MM',name:'Mianmar',dial:'95',flag:'🇲🇲'},
    {iso:'FM',name:'Micronésia',dial:'691',flag:'🇫🇲'},
    {iso:'MZ',name:'Moçambique',dial:'258',flag:'🇲🇿'},
    {iso:'MD',name:'Moldávia',dial:'373',flag:'🇲🇩'},
    {iso:'MC',name:'Mônaco',dial:'377',flag:'🇲🇨'},
    {iso:'MN',name:'Mongólia',dial:'976',flag:'🇲🇳'},
    {iso:'ME',name:'Montenegro',dial:'382',flag:'🇲🇪'},
    {iso:'MS',name:'Montserrat',dial:'1664',flag:'🇲🇸'},
    {iso:'NA',name:'Namíbia',dial:'264',flag:'🇳🇦'},
    {iso:'NR',name:'Nauru',dial:'674',flag:'🇳🇷'},
    {iso:'NP',name:'Nepal',dial:'977',flag:'🇳🇵'},
    {iso:'NI',name:'Nicarágua',dial:'505',flag:'🇳🇮'},
    {iso:'NE',name:'Níger',dial:'227',flag:'🇳🇪'},
    {iso:'NG',name:'Nigéria',dial:'234',flag:'🇳🇬'},
    {iso:'NO',name:'Noruega',dial:'47',flag:'🇳🇴'},
    {iso:'NC',name:'Nova Caledônia',dial:'687',flag:'🇳🇨'},
    {iso:'NZ',name:'Nova Zelândia',dial:'64',flag:'🇳🇿'},
    {iso:'OM',name:'Omã',dial:'968',flag:'🇴🇲'},
    {iso:'PW',name:'Palau',dial:'680',flag:'🇵🇼'},
    {iso:'PS',name:'Palestina',dial:'970',flag:'🇵🇸'},
    {iso:'PA',name:'Panamá',dial:'507',flag:'🇵🇦'},
    {iso:'PG',name:'Papua-Nova Guiné',dial:'675',flag:'🇵🇬'},
    {iso:'PK',name:'Paquistão',dial:'92',flag:'🇵🇰'},
    {iso:'PY',name:'Paraguai',dial:'595',flag:'🇵🇾'},
    {iso:'PE',name:'Peru',dial:'51',flag:'🇵🇪'},
    {iso:'PF',name:'Polinésia Francesa',dial:'689',flag:'🇵🇫'},
    {iso:'PL',name:'Polônia',dial:'48',flag:'🇵🇱'},
    {iso:'PR',name:'Porto Rico',dial:'1787',flag:'🇵🇷'},
    {iso:'PT',name:'Portugal',dial:'351',flag:'🇵🇹'},
    {iso:'KE',name:'Quênia',dial:'254',flag:'🇰🇪'},
    {iso:'KG',name:'Quirguistão',dial:'996',flag:'🇰🇬'},
    {iso:'KI',name:'Quiribati',dial:'686',flag:'🇰🇮'},
    {iso:'GB',name:'Reino Unido',dial:'44',flag:'🇬🇧'},
    {iso:'CF',name:'República Centro-Africana',dial:'236',flag:'🇨🇫'},
    {iso:'DO',name:'República Dominicana',dial:'1809',flag:'🇩🇴'},
    {iso:'CZ',name:'República Tcheca',dial:'420',flag:'🇨🇿'},
    {iso:'RE',name:'Reunião',dial:'262',flag:'🇷🇪'},
    {iso:'RO',name:'Romênia',dial:'40',flag:'🇷🇴'},
    {iso:'RW',name:'Ruanda',dial:'250',flag:'🇷🇼'},
    {iso:'RU',name:'Rússia',dial:'7',flag:'🇷🇺'},
    {iso:'EH',name:'Saara Ocidental',dial:'212',flag:'🇪🇭'},
    {iso:'WS',name:'Samoa',dial:'685',flag:'🇼🇸'},
    {iso:'AS',name:'Samoa Americana',dial:'1684',flag:'🇦🇸'},
    {iso:'SM',name:'San Marino',dial:'378',flag:'🇸🇲'},
    {iso:'LC',name:'Santa Lúcia',dial:'1758',flag:'🇱🇨'},
    {iso:'KN',name:'São Cristóvão e Névis',dial:'1869',flag:'🇰🇳'},
    {iso:'MF',name:'São Martinho',dial:'590',flag:'🇲🇫'},
    {iso:'ST',name:'São Tomé e Príncipe',dial:'239',flag:'🇸🇹'},
    {iso:'VC',name:'São Vicente e Granadinas',dial:'1784',flag:'🇻🇨'},
    {iso:'SC',name:'Seicheles',dial:'248',flag:'🇸🇨'},
    {iso:'SN',name:'Senegal',dial:'221',flag:'🇸🇳'},
    {iso:'SL',name:'Serra Leoa',dial:'232',flag:'🇸🇱'},
    {iso:'RS',name:'Sérvia',dial:'381',flag:'🇷🇸'},
    {iso:'SY',name:'Síria',dial:'963',flag:'🇸🇾'},
    {iso:'SO',name:'Somália',dial:'252',flag:'🇸🇴'},
    {iso:'LK',name:'Sri Lanka',dial:'94',flag:'🇱🇰'},
    {iso:'SD',name:'Sudão',dial:'249',flag:'🇸🇩'},
    {iso:'SS',name:'Sudão do Sul',dial:'211',flag:'🇸🇸'},
    {iso:'SE',name:'Suécia',dial:'46',flag:'🇸🇪'},
    {iso:'CH',name:'Suíça',dial:'41',flag:'🇨🇭'},
    {iso:'SR',name:'Suriname',dial:'597',flag:'🇸🇷'},
    {iso:'TJ',name:'Tadjiquistão',dial:'992',flag:'🇹🇯'},
    {iso:'TH',name:'Tailândia',dial:'66',flag:'🇹🇭'},
    {iso:'TW',name:'Taiwan',dial:'886',flag:'🇹🇼'},
    {iso:'TZ',name:'Tanzânia',dial:'255',flag:'🇹🇿'},
    {iso:'TL',name:'Timor-Leste',dial:'670',flag:'🇹🇱'},
    {iso:'TG',name:'Togo',dial:'228',flag:'🇹🇬'},
    {iso:'TO',name:'Tonga',dial:'676',flag:'🇹🇴'},
    {iso:'TT',name:'Trinidad e Tobago',dial:'1868',flag:'🇹🇹'},
    {iso:'TN',name:'Tunísia',dial:'216',flag:'🇹🇳'},
    {iso:'TM',name:'Turcomenistão',dial:'993',flag:'🇹🇲'},
    {iso:'TR',name:'Turquia',dial:'90',flag:'🇹🇷'},
    {iso:'TV',name:'Tuvalu',dial:'688',flag:'🇹🇻'},
    {iso:'UA',name:'Ucrânia',dial:'380',flag:'🇺🇦'},
    {iso:'UG',name:'Uganda',dial:'256',flag:'🇺🇬'},
    {iso:'UY',name:'Uruguai',dial:'598',flag:'🇺🇾'},
    {iso:'UZ',name:'Uzbequistão',dial:'998',flag:'🇺🇿'},
    {iso:'VU',name:'Vanuatu',dial:'678',flag:'🇻🇺'},
    {iso:'VA',name:'Vaticano',dial:'379',flag:'🇻🇦'},
    {iso:'VE',name:'Venezuela',dial:'58',flag:'🇻🇪'},
    {iso:'VN',name:'Vietnã',dial:'84',flag:'🇻🇳'},
    {iso:'ZM',name:'Zâmbia',dial:'260',flag:'🇿🇲'},
    {iso:'ZW',name:'Zimbábue',dial:'263',flag:'🇿🇼'},
  ];

  // Mapa ISO -> pais pra lookup rapido
  var BY_ISO = {};
  for (var i = 0; i < COUNTRIES.length; i++) BY_ISO[COUNTRIES[i].iso] = COUNTRIES[i];

  function currentCountry(input) {
    var iso = input.dataset.pcIso || 'BR';
    return BY_ISO[iso] || BY_ISO.BR;
  }

  /** Mascara brasileira (00) 00000-0000 — so aplicada quando pais==BR */
  function applyBrMask(v) {
    v = v.replace(/\D/g, '').substring(0, 11);
    if (v.length >= 7)      return v.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
    else if (v.length >= 3) return v.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    else if (v.length >= 1) return v.replace(/^(\d{0,2}).*/, '($1');
    return v;
  }

  /* Ajusta placeholder conforme pais selecionado */
  function updateHint(input) {
    var c = currentCountry(input);
    if (c.iso === 'BR') {
      input.placeholder = '(00) 00000-0000';
      input.setAttribute('maxlength', '15'); // (00) 00000-0000 = 15 chars
      input.setAttribute('inputmode', 'tel');
    } else {
      input.placeholder = '+' + c.dial + ' 000 000 000';
      input.removeAttribute('maxlength');
      input.setAttribute('inputmode', 'tel');
    }
  }

  /** Cria e insere o <select> imediatamente antes do input, envelopa em .pc-wrap */
  function buildSelect(input) {
    var wrap = document.createElement('div');
    wrap.className = 'pc-wrap';
    var sel = document.createElement('select');
    sel.className = 'pc-select';
    sel.setAttribute('aria-label', 'País');
    for (var i = 0; i < COUNTRIES.length; i++) {
      var c = COUNTRIES[i];
      var opt = document.createElement('option');
      opt.value = c.iso;
      opt.textContent = c.flag + ' +' + c.dial + ' ' + c.name;
      if (c.iso === 'BR') opt.selected = true;
      sel.appendChild(opt);
    }
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(sel);
    wrap.appendChild(input);
    input.classList.add('pc-input');
    input.dataset.pcIso = 'BR';

    sel.addEventListener('change', function () {
      input.dataset.pcIso = sel.value;
      updateHint(input);
      // Se sair do BR, remove formatacao BR do valor pra evitar cortes
      if (sel.value !== 'BR') {
        input.value = input.value.replace(/\D/g, '');
      } else {
        input.value = applyBrMask(input.value);
      }
    });

    return sel;
  }

  /** API publica */
  window.PhoneCountry = {
    LIST: COUNTRIES,
    BY_ISO: BY_ISO,

    /** Anexa seletor + handlers ao input existente. Idempotente. */
    attach: function (input) {
      if (!input || input.dataset.pcAttached === '1') return;
      injectCss();
      buildSelect(input);
      input.dataset.pcAttached = '1';
      updateHint(input);

      input.addEventListener('input', function () {
        var c = currentCountry(input);
        if (c.iso === 'BR') {
          var pos = input.selectionStart;
          var before = input.value;
          input.value = applyBrMask(input.value);
          if (pos === before.length) input.setSelectionRange(input.value.length, input.value.length);
        } else {
          // Aceita so digitos, opcionalmente com "+" no inicio (ignorado)
          input.value = input.value.replace(/[^\d]/g, '');
        }
      });
    },

    /** So os digitos que o usuario digitou (sem mascara). */
    digits: function (input) {
      return (input.value || '').replace(/\D/g, '');
    },

    country: function (input) { return currentCountry(input); },

    /** Retorna true se o telefone e valido pro pais atual. */
    validate: function (input) {
      var d = this.digits(input);
      var c = currentCountry(input);
      if (c.iso === 'BR') return /^\d{11}$/.test(d);
      return d.length >= 8 && d.length <= 15;
    },

    /** Mensagem de erro por pais. */
    errorMsg: function (input) {
      var c = currentCountry(input);
      if (c.iso === 'BR') return 'Informe um celular com DDD + 9 dígitos (ex: 19991768411).';
      return 'Informe um número de telefone válido (8 a 15 dígitos).';
    },

    /**
     * Formato pra API:
     *  - Brasil: so digitos "19991768411" (comportamento antigo).
     *  - Fora do Brasil: "+CODIGO+numero" ex "+351912000000".
     */
    getE164: function (input) {
      var d = this.digits(input);
      var c = currentCountry(input);
      if (c.iso === 'BR') return d;
      return '+' + c.dial + d;
    }
  };
})();
