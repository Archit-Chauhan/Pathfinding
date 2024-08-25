const container = document.querySelector('.container');
        const drawWallsButton = document.getElementById('draw-walls');
        const setStartButton = document.getElementById('set-start');
        const setEndButton = document.getElementById('set-end');
        const startDijkstraButton = document.getElementById('start-dijkstra');
        const startAStarButton = document.getElementById('start-a-star');
        const startBFSButton = document.getElementById('start-bfs');
        const resetButton = document.getElementById('reset');
        const timeDisplay = document.getElementById('time-display');

        let mode = null;
        let startNode = null;
        let endNode = null;
        let grid = [];
        const divSize = 20;

        function fillContainer() {
            container.innerHTML = '';
            grid = [];

            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;

            const cols = Math.floor(containerWidth / divSize);
            const rows = Math.floor(containerHeight / divSize);

            container.style.gridTemplateColumns = `repeat(${cols}, ${divSize}px)`;
            container.style.gridTemplateRows = `repeat(${rows}, ${divSize}px)`;

            for (let row = 0; row < rows; row++) {
                const rowDivs = [];
                for (let col = 0; col < cols; col++) {
                    const div = document.createElement('div');
                    div.dataset.row = row;
                    div.dataset.col = col;
                    container.appendChild(div);
                    rowDivs.push({ div, row, col, distance: Infinity, previous: null, isWall: false });
                }
                grid.push(rowDivs);
            }
        }

        function toggleMode(newMode) {
            mode = mode === newMode ? null : newMode;
            drawWallsButton.textContent = mode === 'walls' ? 'Drawing Walls: ON' : 'Draw Walls';
            setStartButton.textContent = mode === 'start' ? 'Set Start: ON' : 'Set Start Position';
            setEndButton.textContent = mode === 'end' ? 'Set End: ON' : 'Set End Position';
        }

        function handleMouseMove(event) {
            if (mode === 'walls' && event.target.matches('.container div')) {
                const div = event.target;
                if (div.style.backgroundColor !== 'black') {
                    div.style.backgroundColor = 'black';
                    const row = parseInt(div.dataset.row, 10);
                    const col = parseInt(div.dataset.col, 10);
                    grid[row][col].isWall = true;
                }
            }
        }

        function handleDivClick(event) {
            if (!event.target.matches('.container div')) return;

            const div = event.target;
            const row = parseInt(div.dataset.row, 10);
            const col = parseInt(div.dataset.col, 10);

            if (mode === 'start') {
                if (startNode) startNode.div.style.backgroundColor = '#eee';
                startNode = grid[row][col];
                startNode.div.style.backgroundColor = 'green';
                startNode.distance = 0;
            } else if (mode === 'end') {
                if (endNode) endNode.div.style.backgroundColor = '#eee';
                endNode = grid[row][col];
                endNode.div.style.backgroundColor = 'red';
            }
        }

        function startAlgorithm(algorithm) {
            if (!startNode || !endNode) {
                alert('Please set both start and end positions.');
                return;
            }

            
            grid.forEach(row => row.forEach(node => {
                if (node !== startNode && node !== endNode) {
                    node.distance = Infinity;
                    node.previous = null;
                }
            }));

            const startTime = performance.now();

            if (algorithm === 'dijkstra') {
                runDijkstra();
            } else if (algorithm === 'a-star') {
                runAStar();
            } else if (algorithm === 'bfs') {
                runBFS();
            }

            const endTime = performance.now();
            const timeTaken = endTime - startTime;
            timeDisplay.textContent = `Time: ${timeTaken.toFixed(2)}ms`;
        }

        function runDijkstra() {
            const openSet = [startNode];
            const directions = [
                [0, 1],  // right
                [1, 0],  // down
                [0, -1], // left
                [-1, 0]  // up
            ];

            const interval = setInterval(() => {
                if (openSet.length === 0) {
                    clearInterval(interval);
                    alert('No path found!');
                    return;
                }

                openSet.sort((a, b) => a.distance - b.distance);
                const currentNode = openSet.shift();

                if (currentNode === endNode) {
                    clearInterval(interval);
                    reconstructPath(currentNode);
                    return;
                }

                currentNode.div.style.backgroundColor = '#ADD8E6';

                for (const [dx, dy] of directions) {
                    const newRow = currentNode.row + dx;
                    const newCol = currentNode.col + dy;

                    if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
                        const neighbor = grid[newRow][newCol];

                        if (!neighbor.isWall && neighbor.distance === Infinity) {
                            neighbor.distance = currentNode.distance + 1;
                            neighbor.previous = currentNode;
                            openSet.push(neighbor);
                            neighbor.div.style.backgroundColor = '#90EE90'; 
                        }
                    }
                }
            }, 20);
        }

        function runAStar() {
            const openSet = [startNode];
            const directions = [
                [0, 1],  // right
                [1, 0],  // down
                [0, -1], // left
                [-1, 0]  // up
            ];

            function heuristic(a, b) {
                return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
            }

            const interval = setInterval(() => {
                if (openSet.length === 0) {
                    clearInterval(interval);
                    alert('No path found!');
                    return;
                }

                openSet.sort((a, b) => (a.distance + heuristic(a, endNode)) - (b.distance + heuristic(b, endNode)));
                const currentNode = openSet.shift();

                if (currentNode === endNode) {
                    clearInterval(interval);
                    reconstructPath(currentNode);
                    return;
                }

                currentNode.div.style.backgroundColor = '#ADD8E6'; 

                for (const [dx, dy] of directions) {
                    const newRow = currentNode.row + dx;
                    const newCol = currentNode.col + dy;

                    if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
                        const neighbor = grid[newRow][newCol];

                        if (!neighbor.isWall && neighbor.distance === Infinity) {
                            neighbor.distance = currentNode.distance + 1;
                            neighbor.previous = currentNode;
                            openSet.push(neighbor);
                            neighbor.div.style.backgroundColor = '#90EE90'; 
                        }
                    }
                }
            }, 20); 
        }

        function runBFS() {
            const openSet = [startNode];
            const directions = [
                [0, 1],  // right
                [1, 0],  // down
                [0, -1], // left
                [-1, 0]  // up
            ];

            const interval = setInterval(() => {
                if (openSet.length === 0) {
                    clearInterval(interval);
                    alert('No path found!');
                    return;
                }

                const currentNode = openSet.shift();

                if (currentNode === endNode) {
                    clearInterval(interval);
                    reconstructPath(currentNode);
                    return;
                }

                currentNode.div.style.backgroundColor = '#ADD8E6'; 

                for (const [dx, dy] of directions) {
                    const newRow = currentNode.row + dx;
                    const newCol = currentNode.col + dy;

                    if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
                        const neighbor = grid[newRow][newCol];

                        if (!neighbor.isWall && neighbor.distance === Infinity) {
                            neighbor.distance = currentNode.distance + 1;
                            neighbor.previous = currentNode;
                            openSet.push(neighbor);
                            neighbor.div.style.backgroundColor = '#90EE90'; 
                        }
                    }
                }
            }, 20);
        }

        function reconstructPath(node) {
            while (node) {
                node.div.style.backgroundColor = 'yellow'; 
                node = node.previous;
            }
        }

        function reset() {
            fillContainer();
            startNode = null;
            endNode = null;
            timeDisplay.textContent = 'Time: 0ms';
        }

        fillContainer();
        window.addEventListener('resize', fillContainer);

        drawWallsButton.addEventListener('click', () => toggleMode('walls'));
        setStartButton.addEventListener('click', () => toggleMode('start'));
        setEndButton.addEventListener('click', () => toggleMode('end'));

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('click', handleDivClick);

        startDijkstraButton.addEventListener('click', () => startAlgorithm('dijkstra'));
        startAStarButton.addEventListener('click', () => startAlgorithm('a-star'));
        startBFSButton.addEventListener('click', () => startAlgorithm('bfs'));

        resetButton.addEventListener('click', reset);