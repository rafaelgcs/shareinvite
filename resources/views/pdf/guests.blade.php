<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Lista de Presença - {{ $event->title }}</title>
    <style>
        body {
            font-family: 'Helvetica', sans-serif;
            color: #1c1917;
            line-height: 1.5;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #D4AF37;
            padding-bottom: 20px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .subtitle {
            color: #78716c;
            font-size: 14px;
            font-style: italic;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background-color: #fafaf9;
            color: #0A0A0A;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-align: left;
            padding: 12px 15px;
            border-bottom: 1px solid #e7e5e4;
        }
        td {
            padding: 12px 15px;
            border-bottom: 1px solid #f5f5f4;
            font-size: 12px;
        }
        .status-present {
            color: #16a34a;
            font-weight: bold;
        }
        .status-waiting {
            color: #a8a29e;
        }
        .footer {
            margin-top: 50px;
            font-size: 10px;
            text-align: center;
            color: #a8a29e;
        }
    </style>
</head>
<body>
    <div className="header">
        <div className="title">{{ $event->title }}</div>
        <div className="subtitle">Lista de Presença Atualizada em {{ now()->format('d/m/Y H:i') }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Convidado</th>
                <th>Extra</th>
                <th>Confirmação</th>
                <th>Check-in</th>
            </tr>
        </thead>
        <tbody>
            @foreach($guests as $guest)
            <tr>
                <td>
                    <strong>{{ $guest->name }}</strong><br>
                    <small>{{ $guest->email }} | {{ $guest->phone }}</small>
                </td>
                <td>+{{ $guest->extra_guests }}</td>
                <td>{{ $guest->confirmed_at ? $guest->confirmed_at->format('d/m/Y H:i') : '-' }}</td>
                <td class="{{ $guest->checked_in_at ? 'status-present' : 'status-waiting' }}">
                    {{ $guest->checked_in_at ? 'Presente (' . $guest->checked_in_at->format('H:i') . ')' : 'Aguardando' }}
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div className="footer">
        © {{ date('Y') }} Miu Invites — Sistema de Gestão de Eventos Premium
    </div>
</body>
</html>
