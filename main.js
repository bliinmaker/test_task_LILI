const services = {
    "services": [
        {
            "id": 1,
            "head": null,
            "name": "Проф.осмотр",
            "node": 0,
            "price": 100.0,
            "sorthead": 20
        },
        {
            "id": 2,
            "head": null,
            "name": "Хирургия",
            "node": 1,
            "price": 0.0,
            "sorthead": 10
        },
        {
            "id": 3,
            "head": 2,
            "name": "Удаление зубов",
            "node": 1,
            "price": 0.0,
            "sorthead": 10
        },
        {
            "id": 4,
            "head": 3,
            "name": "Удаление зуба",
            "node": 0,
            "price": 800.0,
            "sorthead": 10
        },
        {
            "id": 5,
            "head": 3,
            "name": "Удаление 8ого зуба",
            "node": 0,
            "price": 1000.0,
            "sorthead": 30
        },
        {
            "id": 6,
            "head": 3,
            "name": "Удаление осколка зуба",
            "node": 0,
            "price": 2000.0,
            "sorthead": 20
        },
        {
            "id": 7,
            "head": 2,
            "name": "Хирургические вмешательство",
            "node": 0,
            "price": 200.0,
            "sorthead": 10
        },
        {
            "id": 8,
            "head": 2,
            "name": "Имплантация зубов",
            "node": 1,
            "price": 0.0,
            "sorthead": 20
        },
        {
            "id": 9,
            "head": 8,
            "name": "Коронка",
            "node": 0,
            "price": 3000.0,
            "sorthead": 10
        },
        {
            "id": 10,
            "head": 8,
            "name": "Слепок челюсти",
            "node": 0,
            "price": 500.0,
            "sorthead": 20
        }
    ]
}

function createTree(services) {
    let serviceMap = new Map();
    services.forEach(service => {
        serviceMap.set(service.id, { ...service, children: [] });
    });

    let root = { children: [] };
    serviceMap.forEach(service => {
        if (service.head === null) {
            root.children.push(service);
        } else {
            serviceMap.get(service.head).children.push(service);
        }
    });

    function sortChildren(node) {
        node.children.sort((a, b) => a.sorthead - b.sorthead);
        node.children.forEach(child => sortChildren(child));
    }
    sortChildren(root);

    return root;
}

function createDropdownItems(node, depth =  0) {
    let itemsHtml = '';
    node.children.forEach(child => {
        let prefix = Array(depth).fill('&nbsp;&nbsp;&nbsp;').join('');
        let classes = child.node ? 'service-item service-item--expandable' : 'service-item';
        let itemHtml = `<li class="${classes}" data-id="${child.id}">${prefix}${child.name} (${child.price})</li>`;
        itemsHtml += itemHtml;
        if (child.node) {
            itemsHtml += '<ul style="display: none;">';
            itemsHtml += createDropdownItems(child, depth +  1);
            itemsHtml += '</ul>';
        }
    });
    return `<ul>${itemsHtml}</ul>`;
}

function main() {
    const tree = createTree(services.services);
    const dropdownHtml = createDropdownItems(tree);
    document.getElementById('serviceSelectContainer').innerHTML = dropdownHtml;

    document.querySelectorAll('.service-item--expandable').forEach(item => {
        item.addEventListener('click', () => {
            let nextSibling = item.nextElementSibling;
            if (nextSibling.style.display === 'none') {
                nextSibling.style.display = 'block';
                item.classList.add('service-item--expanded');
            } else {
                nextSibling.style.display = 'none';
                item.classList.add('service-item--expandable');
            }
        });
    });
}

main();