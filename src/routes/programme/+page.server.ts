import type { Programme } from '$lib/api/types';

export const load = async () => {
	const programmes: Programme[] = [
		{
			title: 'Kameelah Janan Rasheed: The Unseen',
			description:
				'<p>Occaecat voluptate reprehenderit minim amet. Sunt irure aliqua aliquip nulla deserunt qui occaecat ex quis sit laborum reprehenderit fugiat magna. Proident exercitation non culpa sunt tempor tempor est do.</p> <p>Enim Lorem sit anim occaecat ut labore quis magna officia qui nostrud esse officia pariatur.Dolore laboris ut sint non. Id occaecat aliquip do mollit in. Magna ex ea qui mollit sunt dolor id deserunt. Sit est anim cillum mollit qui adipisicing esse ad laboris irure aute consectetur duis consequat. Consequat culpa commodo quis commodo non cillum deserunt enim fugiat voluptate magna excepteur.</p>',
			type: 'Exhibition',
			link: '#',
			date: '2023-10-01',
			startTime: '10:00 AM',
			cover: 'https://picsum.photos/600/400?random=1'
		},
		{
			title: 'Black Girl',
			description:
				'<p>Cillum laborum tempor elit proident ipsum ea aute consectetur velit quis deserunt proident nulla est nulla. Voluptate exercitation nisi reprehenderit non mollit laborum fugiat. In consequat ullamco sint Lorem eu consectetur pariatur. Magna aliqua fugiat minim cupidatat fugiat nulla eu ut id. Qui magna enim quis exercitation velit non dolore ex ex.</p> <p>Velit veniam labore voluptate occaecat aute aliquip aliqua tempor cillum do pariatur. Magna aliqua sunt incididunt reprehenderit aliqua reprehenderit ad mollit eu. Id irure officia duis sint quis exercitation ad ipsum minim adipisicing esse aliquip ea anim. Excepteur fugiat ut fugiat ex amet voluptate et ipsum. Fugiat commodo exercitation non ea aliqua. Proident cupidatat esse cillum anim officia proident labore exercitation.</p><p>Qui magna qui ex labore mollit id quis reprehenderit duis commodo ad. Commodo nulla Lorem nostrud ut veniam amet id ullamco. Laboris excepteur quis sit commodo proident magna occaecat dolore sit tempor eu in. Eiusmod deserunt dolor consectetur reprehenderit aliquip ea ea cupidatat sit ea tempor. Lorem enim magna sint cupidatat. Amet eu velit in ut ad ea nulla in velit irure ullamco enim eiusmod.</p>',
			type: 'Screening',
			link: '#',
			date: '2023-11-15',
			startTime: '09:00 AM',
			cover: 'https://picsum.photos/600/400?random=2'
		},
		{
			title: 'Beloved By Toni Morrison',
			description:
				'<p>Excepteur excepteur excepteur enim consectetur. Dolor amet incididunt ad excepteur. Adipisicing exercitation est excepteur pariatur. Dolore laboris in reprehenderit Lorem. Aute labore occaecat voluptate aliqua.</p> <p>Excepteur enim laborum do dolore. Nisi deserunt id eiusmod commodo. Dolor dolor aliquip fugiat ullamco. Laborum qui ipsum mollit officia.</p>				<p>Excepteur excepteur excepteur enim consectetur. Dolor amet incididunt ad excepteur. Adipisicing exercitation est excepteur pariatur. Dolore laboris in reprehenderit Lorem. Aute labore occaecat voluptate aliqua.</p><p>Excepteur enim laborum do dolore. Nisi deserunt id eiusmod commodo. Dolor dolor aliquip fugiat ullamco. Laborum qui ipsum mollit officia.</p> <p>Excepteur excepteur excepteur enim consectetur. Dolor amet incididunt ad excepteur. Adipisicing exercitation est excepteur pariatur. Dolore laboris in reprehenderit Lorem. Aute labore occaecat voluptate aliqua.</p>',
			type: 'Library',
			link: '#',
			date: '2023-12-01',
			startTime: '11:00 AM',
			cover: ''
		}
	];
	return {
		site: {
			programmes
		}
	};
};
